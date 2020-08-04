import { setAutoFreeze } from "immer"
import { createContext, useContext } from "react"
import { Updater } from "use-immer"
import { _provider } from "./components/_provider"
import { ArgProps, Init, SetProduce, SetProduceSingle, SetStore, UseSetStore, UseStore } from "./_types"

type ReturnProps<T> = [
    React.FC,
    UseStore<T>,
    () => UseSetStore<T>
]

export type ICTX<T> = {
    [K in keyof T]?: {
        [F in keyof T[K]]?: {
            initState: T[K][F]
            Context: React.Context<T[K][F]>
            SetContext: React.Context<Updater<T[K][F]>>
        }
    }
}

const isObject = (variable: any) => {
    console.log(variable)
    return Object.prototype.toString.call(variable) === '[object Object]'
}


export const useDSC = <T extends Init>(INITSTATE: T, ARGS?: ArgProps): ReturnProps<T> => {

    if (ARGS) {
        ARGS.disableAutoFreeze && setAutoFreeze(false)
    }

    const CTX: ICTX<T> = Object.entries(INITSTATE).reduce((prev, [key, val]) => {

        const subCTX = isObject(val) ?
            Object.entries(val).reduce((prev, [field, init]) => {
                return {
                    ...prev,
                    [field]: {
                        initState: init,
                        Context: createContext(init),
                        SetContext: createContext(null)
                    }
                }
            }, {})
            :
            ({
                [key]: {
                    initState: val,
                    Context: createContext(val),
                    SetContext: createContext(null)
                }
            })

        return {
            ...prev,
            [key]: subCTX
        }
    }, {})

    const ContextProvider: React.FC = _provider(CTX)

    const useStore: UseStore<T> = (key, field = null) => {
        return useContext(CTX[key][field || key].Context)
    }

    const setStore = () =>
        Object.keys(CTX).reduce(<K extends keyof T>(prev, KEY: K) => {

            const nestedStore = () => Object.keys(CTX[KEY]).reduce(<F extends keyof T[K]>(prevField, FIELD: F) => {

                const { SetContext } = CTX[KEY][FIELD]

                const produce: Updater<T[K][F]> = useContext(SetContext)
                const newProduce: SetProduce<T, K, F> = (cb) => {
                    produce((draft) => {
                        return typeof cb === "function" ? cb(draft, INITSTATE[KEY][FIELD]) : cb
                    })
                }

                return {
                    ...prevField,
                    [FIELD]: newProduce
                }
            }, {} as SetStore<T, K>)

            const singleStore = (): SetProduceSingle<T, K> => {

                const { SetContext } = CTX[KEY][KEY]
                const produce: Updater<T[K][K]> = useContext(SetContext)
                const newProduce: SetProduceSingle<T, K> = (cb) => {
                    produce((draft) => {
                        return typeof cb === "function" ? cb(draft, INITSTATE[KEY]) : cb
                    })
                }
                return newProduce
            }

            const Store = isObject(INITSTATE[KEY]) ? nestedStore() : singleStore()


            return {
                ...prev,
                [KEY]: Store
            }

        }, {} as UseSetStore<T>)



    return [
        ContextProvider,
        useStore,
        setStore,
    ]

}