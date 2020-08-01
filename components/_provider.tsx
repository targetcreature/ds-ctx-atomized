import { useImmer } from 'use-immer'
import { ICTX } from '..'
import { Init } from '../_types'

export const _provider = <T extends Init>(CTX: ICTX<T>) => ({ children }) => {

    const Context = Object.keys(CTX).reduceRight((prevSub, KEY) => {

        const SubContext = Object.values(CTX[KEY]).reduceRight((prev, VAL) => {

            const { Context, SetContext, initState } = VAL
            const [store, set] = useImmer(initState)

            return (
                <Context.Provider value={store}>
                    <SetContext.Provider value={set}>
                        {prev}
                    </SetContext.Provider>
                </Context.Provider>
            )

        }, children)


        return (
            <SubContext>{prevSub}</SubContext>
        )

    }, children)

    return Context

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