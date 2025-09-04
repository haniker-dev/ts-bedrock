# Product and Sum Types

## Product Type (aka Object Type in Typescript)
```typescript
type ShoppingCartProduct = {
  name: string
  price: number
}

type FormData = {
  name: string
  email: string
  message: string
}
```
### Exercise
Design a product type for user with name, email and _age?_
Create a function `introduceUser` 
that takes a user and returns the user's introduction
like this `Hi, I am {name} and I am {age} years old`

## Sum Type (aka Union Type in Typescript)
```typescript
type SumType = "A" | "B" | "C"

type AccessRole = "SuperAdmin" | "Admin" | "Guest"

type ValidateError = 
  | "INVALID_EMAIL" 
  | "INVALID_PASSWORD" 
  | "INVALID_USERNAME"

type MaybeValidateError = ValidateError | null
type MaybeString = string | null
type MaybeNumber = number | null
```
Create a function `showErrorMessage` that takes a `ValidateError` 
and returns a user-friendly error message to show to the user

## Product + Sum Type
```typescript
type MaybeStr = string | null
type MaybeNum = string | null
// Example
type User = {
  name: MaybeStr
  age: MaybeNum
}

type ResultStr = 
  | { _t: "Err", error: string } 
  | { _t: "Ok", value: string }

type RemoteDataStr = 
  | { _t: "NotAsked" }
  | { _t: "Loading" }
  | { _t: "Failure", error: string }
  | { _t: "Success", data: string }
```
[DEMO] `function showMaybeResult(m: MaybeStr): string`
[DEMO] `function showResultResult(m: ResultStr): string`
[KEY] Switch cases for sum type
[KEY] Type checking for `_t` and `data`

### Exercise
Create a function `showApiStatus` that takes a `RemoteData` and returns the status message

Create a function `validateEmailResult` that takes an email string
and returns an Result with the error message or the email

Create a function `validateEmailMaybe` that takes an email string
and returns a Maybe with the email

In frontend, we usually have form for users to fill in.
The form usually has various states such as: "Error", "Submitting", "Success", etc.
Design a sum type `FormStatus` that captures all possible states of a form
Can a submit button use this `FormStatus` type to determine if it is disabled?
Try writing `function isDisabled(status: FormStatus): boolean`

## Result vs Maybe
- Error handling
  - Use `Result` type if we want to handle the error (most common)
  - Use `Maybe` type if we don't want to handle the error (most common)
  - Only use `throw new Error()` if we don't want to handle the exception (rare)
    - Never use in frontend
    - Only used in backend where the error is not recoverable
    - Exception Example: Database connection failure is an exception which no one can handle
    - Error Example: Validating an email may fail which can be handled
      so we should return `ResultStr` or `string | null`
