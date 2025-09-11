export type RemoteData<E, T> = NotAsked | Loading | Failure<E> | Success<T>

export type NotAsked = { _t: "NotAsked" }
export type Loading = { _t: "Loading" }
export type Failure<E> = { _t: "Failure"; error: E }
export type Success<T> = { _t: "Success"; data: T }

export function notAsked<E, T>(): RemoteData<E, T> {
  return { _t: "NotAsked" }
}

export function loading<E, T>(): RemoteData<E, T> {
  return { _t: "Loading" }
}

export function failure<E, T>(error: E): RemoteData<E, T> {
  return { _t: "Failure", error }
}

export function success<E, T>(data: T): RemoteData<E, T> {
  return { _t: "Success", data }
}

export function map<E, T>(
  fn: (t: T) => T,
  remoteData: RemoteData<E, T>,
): RemoteData<E, T> {
  return remoteData._t === "Success"
    ? { ...remoteData, data: fn(remoteData.data) }
    : remoteData
}

export function getError<E, T>(remoteData: RemoteData<E, T>): E | null {
  return remoteData._t === "Failure" ? remoteData.error : null
}

export function getData<E, T>(remoteData: RemoteData<E, T>): T | null {
  return remoteData._t === "Success" ? remoteData.data : null
}
