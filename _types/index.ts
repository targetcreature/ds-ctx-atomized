
export type ArgProps = {
    disableAutoFreeze?: boolean
}

export type Init = { [k: string]: any }

export type UseStore<T> =
    <K extends keyof T, F extends keyof T[K]>
        (key: K, field?: F) => T[K][F]


type SetCallback<T, K extends keyof T, F extends keyof T[K]> = (draft: T[K][F], init: T[K][F]) => T[K][F]
export type SetProduce<T, K extends keyof T, F extends keyof T[K]> = (value?: T[K][F] | null, cb?: SetCallback<T, K, F>) => void

type SetCallbackSingle<T, K extends keyof T> = (draft: T[K], init: T[K]) => T[K]
export type SetProduceSingle<T, K extends keyof T> = (value?: T[K] | null, cb?: SetCallbackSingle<T, K>) => void


export type SetStore<T, K extends keyof T> = {
    [F in keyof T[K]]: (value?: T[K][F] | SetCallback<T, K, F>) => void
}

export type SetStoreSingle<T, K extends keyof T> = (value?: T[K] | SetCallbackSingle<T, K>) => void

export type UseSetStore<T> = {
    [K in keyof T]: Switcher<T, K>
}

type Single = number | string | any[]
type Switcher<T, K extends keyof T> = T[K] extends Single ? SetStoreSingle<T, K> : SetStore<T, K>