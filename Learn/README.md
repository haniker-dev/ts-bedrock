# Learn TypeFirst

## Pre-requisites
- Setup IDE with Typescript LSP
- Clone main [repo](https://github.com/haniker-dev/ts-bedrock/tree/Learn/Learn)
- Read Typescript Handbook:
  - [Basic Types](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
  - [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  - [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
  - [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
  - [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
  - Sub-pages in [Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## Course Rules
- Fully typed
  - BANNED: `any`, `as`, `is`, `!`
  - ALWAYS: Write all type signatures (ie. `function strLen(s: string): number`)
- Adopt functional programming style 
  - No OOP, classes or attaching methods to object
- Golden Rule: Type First!!!

## Day 1 - Understanding Types and Functional Programming Style
- Immutability
  - Mutating data leads to bugs and side-effects that are very difficult to debug
  - https://github.com/eslint-functional/eslint-plugin-functional/blob/main/docs/rules/immutable-data.md

- Product type + Sum type (Lecture/ProductSumTypes.md)
  - Impossible cases
  - Switch case for sum type
  - Result vs Maybe

- Generic type (Lecture/Generic.md)

- Decoding
  - Unverified data like API request params MUST be verified and decoded into known types before we allow it to be used in our system
  - Read https://decoders.cc
  - [DEMO] all kinds of decoding
    - object
    - array
    - sum types
    - product x sum types `_t`
    - generic type decoding

- Opaque types (Lectures/OpaqueTypes.md)
  - Why opaque type? `type Email = string`
  - Email
  - Timestamp
  - Many other Data Opaque types: Nat + PositiveInt
  - Exercise: Review previous Crazy Contact Form

## Day 2 - Bedrock Walkthrough
- Walkthrough ts-bedrock
  - ts-bedrock-core
  - ts-bedrock-api
  - ts-bedrock-web
- Highlight on FTFC

## Day 3 - Code Contact Us feature 
- Code a simple contact us form
  - Provide the TypeSpec for the contact us form
  - Implement the API feature
  - Implement the Web feature

## Day 4 - Drills
- Finish the feature
- Provide Change Request for the feature
  - Add to a sum type
  - Add new validation
  - Try to avoid specific database migration, React features, etc
    and to focus on Bedrock/TypeSpec

## Day 5 - Review
- Finish all the drills
- Type Cardinality (Lectures/Cardinality.md)
  - [KEY] Impossible cases
- Review all the concepts
- Feedback session
