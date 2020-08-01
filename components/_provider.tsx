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

// import { useImmer } from 'use-immer'
// import { ICTX } from '..'
// import { Init } from '../_types'

// export const _provider = <T extends Init>(CTX: ICTX<T>) => ({ children }): React.FC => {

//     const Provider: React.FC = Object.keys(CTX).reduceRight((prev, key) => {

//         const SubContext = Object.values(CTX[key]).reduceRight((prevKey, VAL) => {
//             const { Context, SetContext, initState } = VAL
//             const [store, set] = useImmer(initState)
//             return (
//                 <Context.Provider value={store}>
//                     <SetContext.Provider value={set}>
//                         {prevKey}
//                     </SetContext.Provider>
//                 </Context.Provider>
//             )
//         }, () => null as React.FC)

//         return (
//             <SubContext>
//                 {prev}
//             </SubContext>
//         )

//     }, children)

//     return (
//         <Provider>{children}</Provider>

// }