type Either<E, T> = { _t: "Left"; error: E } | { _t: "Right"; value: T }

export type FormData = {
  name: string
  email: string
  message: string
}

type ValidateError = "INVALID_EMAIL" | "INVALID_PASSWORD" | "INVALID_USERNAME"

type FormValidateResult = Either<ValidateError, FormData>

// Exercise 1: Complete this function
export function validateFormData(_form: FormData): FormValidateResult {
  throw new Error("TODO")
}

// Exercise 2: Generalise `RemoteDataStr` to `RemoteData<E,T>`
// Fix the function `showRemoteDataResult` to use the new `RemoteData<E,T>` type
// Bonus: What if we want to allow custom conversion of E and T to string in `showRemoteDataResult`?
type RemoteDataStr =
  | { _t: "NotAsked" }
  | { _t: "Loading" }
  | { _t: "Failure"; error: string }
  | { _t: "Success"; data: string }
export function showRemoteDataResult(_data: RemoteDataStr): string {
  throw new Error("TODO")
}

// Exercise 3: Design a Generic Sum Type for `ApiResponse`
