import { useImmer } from 'use-immer'
import { ICTX } from '..'
import { Init } from '../_types'

export const _provider = <T extends Init>(CTX: ICTX<T>) => ({ children }) => {
    const Context = Object.values(CTX).reduceRight((prev, val) => {
        const SubContext = _subProvider(val)
        return (
            <SubContext>{prev}</SubContext>
        )
    }, children)
    return Context
}

const _subProvider = <T extends Init>(CTX: ICTX<T>[0]) => ({ children }) => {

    const SubContext = Object.values(CTX).reduceRight((prev, val) => {

        const { Context, SetContext, initState } = val
        const [store, set] = useImmer(initState)

        return (
            <Context.Provider value={store}>
                <SetContext.Provider value={set}>
                    {prev}
                </SetContext.Provider>
            </Context.Provider>
        )

    }, children)

    return SubContext
}