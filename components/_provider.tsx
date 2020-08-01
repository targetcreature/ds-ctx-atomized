import { useImmer } from 'use-immer'
import { ICTX } from '..'
import { Init } from '../_types'

export const _provider = <T extends Init>(CTX: ICTX<T>) => ({ children }) => {

    const Provider = Object.keys(CTX).reduceRight((prev, key) => {

        const SubContext = Object.values(CTX[key]).reduceRight((prev, VAL) => {

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
            <SubContext>
                {prev}
            </SubContext>
        )

    }, children)

    return Provider

}