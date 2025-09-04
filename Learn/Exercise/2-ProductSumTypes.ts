// Exercise 1
// Design a product type for user with name, email and _age?_
// Create a function `introduceUser`
// that takes a user and returns the user's introduction
// like this `Hi, I am {name} and I am {age} years old`

// Exercise 2
// Create a function `showErrorMessage` that takes a `ValidateError`
// and returns a user-friendly error message to show to the user
export type ValidateError =
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "INVALID_USERNAME"

// Exercise 3
// Create a function `showApiStatus`
// that takes a `RemoteData` and returns the following strings
// - NotAsked: "Please click the button to load data"
// - Loading: "Loading..."
// - Failure: "Failed to load data: ${error}"
// - Success: "Data loaded successfully: ${data}"
// Verify for yourself
// - TS error when you try to get error or data from NotAsked and Loading sum type variants
// - TS error when you try to get data from failure variant
// - TS error when you change the _t value
// - TS error when you add new variant (eg. { _t: "NewVariant" })
export type RemoteDataStr =
  | { _t: "NotAsked" }
  | { _t: "Loading" }
  | { _t: "Failure"; error: string }
  | { _t: "Success"; data: string }

// Exercise 4
// Create a function `validateEmailResult` that takes an email string
// and returns an Result with the error message or the email

// Exercise 5
// Create a function `validateEmailMaybe` that takes an email string
// and returns a Maybe with the email

// Exercise 6
// In frontend, we usually have form for users to fill in.
// The form usually has various states such as: "Error", "Submitting", "Success", etc.
// Design a sum type `FormStatus` that captures all possible states of a form
// Can a submit button use this `FormStatus` type to determine if it is disabled?
// Try writing `function isDisabled(status: FormStatus): boolean`
