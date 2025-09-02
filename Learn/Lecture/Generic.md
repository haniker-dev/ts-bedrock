## Generic Type
```typescript
type MaybeStr = string | null
type MaybeNum = number | null
type User = {
  name: MaybeStr
  age: MaybeNum
}

type Maybe<T> = T | null
type User = {
  name: Maybe<string>
  age: Maybe<number>
}
```
[DEMO] `function showMaybeResult<T>(m: Maybe<T>): string`


```typescript
type EitherStr = 
  | { _t: "Left", error: string } 
  | { _t: "Right", value: string }
type EitherNum = 
  | { _t: "Left", error: string } 
  | { _t: "Right", value: number }
type UserForm = {
  nameField: EitherStr
  ageField: EitherNum
}

type Either<E, T> = 
  | { _t: "Left", error: E } 
  | { _t: "Right", value: T }
type UserForm = {
  nameField: Either<string, string>
  ageField: Either<string, number>
}
```
[DEMO] `function showEitherResult(m: EitherStr): string`


### Exercise
```typescript
type FormData = {
  name: string
  email: string
  message: string
}
type ValidateError = 
  | "INVALID_EMAIL" 
  | "INVALID_PASSWORD" 
  | "INVALID_USERNAME"
type FormValidateResult = Either<ValidateError, FormData>
```
Implement `function validateFormData(form: FormData): FormValidateResult`

New requirement:
```typescript
type FormData = {
  name: Maybe<string>
  email: string
  message: string
}
```
[KEY] See type errors and follow the type errors to fix the code
Update `function showFormResult(formStatus: FormStatus): string`

```typescript
type RemoteDataStr = 
  | { _t: "NotAsked" }
  | { _t: "Loading" }
  | { _t: "Failure", error: string }
  | { _t: "Success", data: string }
```
Generalise `RemoteDataStr` to `RemoteData<E,T>`
Implement `function showRemoteDataResult<E,T>(data: RemoteData<E,T>): string`
Bonus: What if we want to allow custom conversion of E and T to string in `showRemoteDataResult`?

```typescript

### Exercise
Design a Generic Sum Type for `ApiResponse`

[New Course Rule]: Always use `Maybe` for nullable data
[New Course Rule]: Always use `Either` if there is a possibility of error
