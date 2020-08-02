export type ArgProps = {
    disableAutoFreeze?: boolean
}

export type Init = { [k: string]: any }

type SetCallback<T, K extends keyof T, F extends keyof T[K]> = (draft: T[K][F], init: T[K][F]) => T[K][F]

export type SetStore<T, K extends keyof T> = {
    [F in keyof T[K]]: (value?: T[K][F] | SetCallback<T, K, F>) => void
}

export type SetProduce<T, K extends keyof T, F extends keyof T[K]> = (value?: T[K][F] | null, cb?: SetCallback<T, K, F>) => void

export type UseStore<T> = <K extends keyof T>(key: K) => <F extends keyof T[K]>(field: F) => T[K][F]

export type UseSetStore<T> = {
    [K in keyof T]: SetStore<T, K>
}