import { setAutoFreeze } from "immer"
import { createContext, useContext } from "react"
import { Updater } from "use-immer"
import { _provider } from "./components/_provider"
import { ArgProps, Init, SetProduce, SetStore, UseSetStore, UseStore } from "./_types"

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


export const useDSC = <T extends Init>(INITSTATE: T, ARGS?: ArgProps): ReturnProps<T> => {

    if (ARGS) {
        ARGS.disableAutoFreeze && setAutoFreeze(false)
    }

    const CTX: ICTX<T> = Object.keys(INITSTATE).reduce((prev, key) => {

        const subCTX = Object.entries(INITSTATE[key]).reduce((prev, [field, init]) => {
            return {
                ...prev,
                [field]: {
                    initState: init,
                    Context: createContext(init),
                    SetContext: createContext(null)
                }
            }
        }, {})

        return {
            ...prev,
            [key]: subCTX
        }
    }, {})

    const ContextProvider = _provider(CTX)


    const useStore: UseStore<T> = (key) => (field?) => {
        const index = Object.keys(CTX[key]).length > 1 ? field : key
        return useContext(CTX[key][index].Context)
    }

    const setStore = () =>
        Object.keys(CTX).reduce(<K extends keyof T>(prev, KEY: K) => {

            const Store = Object.keys(CTX[KEY]).reduce(<F extends keyof T[K]>(prevField, FIELD: F) => {

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

            return {
                ...prev,
                [KEY]: Store
            }
        }, {} as UseSetStore<T>)

    // const setStore = (): UseStore<T> =>
    //     Object.keys(CTX).reduce(<K extends keyof T>(prevKey: SetStore<T, K>, KEY: K) => {

    //         const Stores = Object.keys(CTX[KEY]).reduce(<F extends keyof T[K]>(prevField: SetStore<T, K>[F], FIELD: F) => {

    //             const { SetContext } = CTX[KEY][FIELD]

    //             const produce: Updater<T[K][F]> = useContext(SetContext)

    //             const newProduce: SetProduce<T, K, F> = (cb) => {
    //                 produce((draft) => {
    //                     return typeof cb === "function" ? cb(draft, INITSTATE[KEY][FIELD]) : cb
    //                 })
    //             }

    //             return {
    //                 ...prevField,
    //                 [FIELD]: newProduce
    //             }

    //         }, {})

    //         return {
    //             ...prevKey,
    //             [KEY]: Stores
    //         }

    //     }, {} as UseSetStore<T>)

    return [
        ContextProvider,
        useStore,
        setStore,
    ]

}