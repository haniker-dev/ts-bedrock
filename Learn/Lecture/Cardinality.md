# Type Cardinality

## The cardinality of a type is the number of possible legal values that can be of that type

What is the cardinality of the following types?

```typescript
type Toggle = boolean

type Direction =
  | "North"
  | "South"
  | "East"
  | "West"

type Email = string
type Timestamp = number

type booleanArray = [boolean, boolean]
type booleanArray = Array<boolean>
type stringArray = string[]

type FormStatus = {
  isValid: boolean
  isSubmitting: boolean
  isSuccess: boolean
  isFailure: boolean
}

```

### Impossible State
Impossible cases are state/data that are invalid and should not exist.
In designing types, we always strive to *Make Impossible State Impossible*.

```typescript
type FormStatus = {
  isValid: boolean
  isSubmitting: boolean
  isSuccess: boolean
  isFailure: boolean
}

type Platform = "Web" | "Mobile" | "IoT" | "AI"
type SelectedPlatform = Array<Platform>
```
