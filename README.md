# A TypeFirst approach for Typescript project

## Setting up
- Run `npm install` at root, `/Api` and `/Web`
- Read `package.json` for more scripts

## Introduction
This repo is a template for a Typescript project that follows a TypeFirst approach.
Core repo contains Type-1 (App types) and Type-3 (API Contracts) definitions and functions (FTFC).

## Type Specifications
TypeSpec is a specification for defining types in Typescript for the entire application (Web/Api/database/etc).
It has 5 levels of specifications:
Type-1: The core types that are used in the application such as User in all platforms (eg. Web/Api/database)
Type-2: The database types that represents the table in the database (eg. UserRow => user db table)
Type-3: The API types (aka API contract) that represents the request/response of the API 
Type-4: The frontend state types
Type-5: The frontend action types

## File Structure
As this repo is meant to be imported for other repo, there is no `/src` folder.
`/Api`: Contains all Type-3 (API Contracts) definitions and functions
`/App`: Contains all Type-1 (App types) definitions and functions which are used in this project
`/Data`: Contains all Type-1 common data types and functions which can be reused in any project
`/spec`: Test cases

## TypeFirst Principles and Conventions
- Fully typed 
  - Absolutely NO `any` type and no usage of `as`, `is` and `!` 
  - No coercion of types (eg. `const user = unknownJson as User`)
  - unknown types are ALWAYS decoded using (decoders)[https://github.com/nvie/decoders]
  - Use `string | null` typing to reflect that something can be missing. Do not default!
  - Learn all about Typescript here: https://www.typescriptlang.org/docs/handbook/intro.html

- Adopt functional programming style 
  - No OOP, classes, attaching methods to object
  - Use common functional data types such as `Result` or `Maybe` in `/Core/Data/*`

- FTFC: Function follows Type, Type follows File, File follows Context
  - This is a functional programming convention to build a common and intuitive file/folder structure which promotes function discovery
  - (Function follows Type): Any functions that focuses on a Type will be found in that type file
    - Eg: `function addDays(t: Timestamp, n: number): Timestamp` will be found in `Timestamp.ts`
  - (Type follows File): A file is usually named after the Type it is defined in or the context it works in
    - Eg: `type Timestamp = number` will be found in a file called `Timestamp.ts`
    - Eg: `/Api/src/Database.ts` is the file to serve database
  - (File follows Context): A file can be nested within directories and each directory represents the context of that file.
    Context is generally about usage or feature or SRP (Single Responsibility Principle) boundaries.
    - Eg: `Timestamp.ts` which holds the type `Timestamp` can be placed in `/Core/Data/Timestamp.ts`
    - Eg: `AdminRow.ts` which holds the type `AdminRow` representing a database row in the database can be placed in `/Api/src/Database/AdminRow.ts`
    - Eg: `/Api/src/App/User.ts` holds functions that do transformations targeting the type `User` in `/Core/App/User.ts`

- Error handling
  - Use `Result` type if we want to handle the error (most common)
  - Use `Maybe` type if we don't want to handle the error (most common)
  - Only use `throw new Error()` if we don't want to handle the exception (rare)
    - Never use in frontend
    - Only used in backend where the error is not recoverable
    - Exception Example: Database connection failure is an exception which no one can handle
    - Error Example: Transforming a string to int may fail which can be handled 
      so we should return `Result<string, number>` or `number | null`

## TODO
- Timestamp: We need Time/Second.ts, etc types

## Enhancement
- Enforce no throw
- A faster decoder library
- Use deno
