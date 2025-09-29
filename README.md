# A TypeFirst approach for Typescript project

## Setting up
- Run `npm install` at root, `/Api` and `/Web`
- Read `package.json` for more scripts

## Introduction
This repo is a template for a Typescript project that follows a TypeFirst approach. It is a monorepo which contains the core types, API backend and Web frontend.

## Type Specifications
TypeSpec is a specification for defining types in Typescript for the entire application (Web/Api/database/etc).
It has 5 levels of specifications:
Type-1: The core types that are used in the application such as User in all platforms (eg. Web/Api/database)
Type-2: The database types that represents the table in the database (eg. UserRow => user db table)
Type-3: The API types (aka API contract) that represents the request/response of the API 
Type-4: The frontend state types
Type-5: The frontend action types/functions

## File Structure
`/Core/Api`: Contains all Type-3 (API Contracts) definitions and functions
`/Core/App`: Contains all Type-1 (App types) definitions and functions which are used in this project
`/Core/Data`: Contains all Type-1 common data types and functions which can be reused in any project
`/Api/database`: Contains database migrations and seeds
`/Api/src/Api`: This folder contains the API handlers which fulfills the core's T3 contracts
`/Api/src/App`: This folder contains the transformations of API types to core types
`/Api/src/Data`: Contains all common data types and functions which can be reused in any *API* project
`/Api/src/Database`: Contains all the T2 database row types and functions
`/Api/src/Route`: Contains all the routes for the API which links T3 contracts to API handlers
`/Web/public`: Web assets as per Vite
`/Web/src/Action`: Contains all the actions
`/Web/src/Api`: Contains the API call function which fulfills the core's T3 contracts
`/Web/src/App`: Contains the transformations of web types to core/API types or specific implementations for the project in web
`/Web/src/Data`: Contains all common data types and functions which can be reused in any *Web* project
`/Web/src/Page`: Contains pages of Web (Generally named after routes)
`/Web/src/Route.ts`: Contains all the routes
`/Web/src/Runtime`: Contains the runtime files
`/Web/src/State`: Contains states of Web
`/Web/src/View`: Contains view files which are reusable across Pages
  - Form: Contains form view components Eg: Button, Input, etc
  - Layout: Contains layout view components
  - Theme: Define the theme of the web Eg: spacing, colors, font, etc
  - ImageLocalSrc: Define local images
  - Link: `a` tag with required props to navigate among routes
`/spec`: Test cases

## Api Runtime
The API folder uses the Core folder's `/Core/Api` Type 3 contracts to implement handlers to serve the APIs.
This allows us to bind the types of API params/response to Core folder which in turn are being imported by Web folder to call the APIs. 
This way, we can ensure that the API params/response are consistent across the Core, API, and Web folders.

The general idea of how API folder works is as follows:
- Entry file is `/Api/src/index.ts` where an Express instance is created.
- Routes are added to the Express instance which binds a handler function with its corresponding T3 contract to the Express instance.
  Routes are defined in `/Api/src/Route.ts` and `/Api/src/Route/*`.
  Refer to `/Api/src/Api/PublicApi.ts` and `/Api/src/Api/AuthApi.ts` for implementation details.
- The handler function is a "pure" function that takes the params of the T3 contract and returns an `Result` type of the T3 contract ErrorCode and Payload.
  This allows easy testing of the handler without spinning up the Express instance in test cases.
  Handlers are defined in `/Api/src/Api/*`.
- Handler function uses database functions defined in `/Api/src/Database/*` to interact with the database.

## Web Runtime
Please read core README for TypeSpec and principles/conventions

The runtime follows closely to The Elm Architecture (TEA) 
where View is pure function of State
and State is only changed on Action (usually triggered from user's interaction or subscription)
[![](https://mermaid.ink/img/pako:eNqNkU1LBDEMhv9KyEWQmYvHIsKgF2_CgJftHso0o4V-SD9WZN3_btrqzu7NHmbaN0_yJuSIS9CEAlNWmZ6MeovKjYc76YFPE0HiXP8SQSWYryPTkk3wIATsGjTAo9P7jk7Sd9gHZi2tGcJaVbg4W4GWD-PDdaUrmJVKvsTgTKL7v-Rv8MVa4Ey4SCCvm3NX-nd3u4eRLZ69yX2oJp-fLfhq6LPr9dakSQD7lETxJoHxmaJq1h2bGjML8IynrWzXuen_tFxn-7WKlII9kO6B-dxUjYyR56KIAzqKThnNuztWUGJ-J8dbEnzVtKpis0TpT4yqksP85RcUORYasHzobdsoVmUTnX4ATcedeg?type=png)](https://mermaid.live/edit#pako:eNqNkU1LBDEMhv9KyEWQmYvHIsKgF2_CgJftHso0o4V-SD9WZN3_btrqzu7NHmbaN0_yJuSIS9CEAlNWmZ6MeovKjYc76YFPE0HiXP8SQSWYryPTkk3wIATsGjTAo9P7jk7Sd9gHZi2tGcJaVbg4W4GWD-PDdaUrmJVKvsTgTKL7v-Rv8MVa4Ey4SCCvm3NX-nd3u4eRLZ69yX2oJp-fLfhq6LPr9dakSQD7lETxJoHxmaJq1h2bGjML8IynrWzXuen_tFxn-7WKlII9kO6B-dxUjYyR56KIAzqKThnNuztWUGJ-J8dbEnzVtKpis0TpT4yqksP85RcUORYasHzobdsoVmUTnX4ATcedeg)

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
  - Never throw unless
    - within decoders using `.verify` (because decoders catches it)
    - error is not recoverable (eg. database connection failure)
    - Exception Example: Database connection failure is an exception which no one can handle
    - Error Example: Transforming a string to int may fail which can be handled so we should return `Result<string, number>` or `number | null`

## TODO
Core
  - Timestamp: We need Time/Second.ts, etc types
  - Devops add example staging/production deployment
Api
  - Add check for duplicated routes in Express
  - Devops add example staging/production deployment
Web
  - Add RemoteCache
  - Add RemotePage

## Enhancement
Core
  - Enforce no throw
  - A faster decoder library
  - Use deno
Api
  - Switch to Fastify or upgrade to Express 5
Web
  - Use Preact or write our own render library to remove `emit`
