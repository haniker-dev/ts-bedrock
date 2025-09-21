# A Type-First approach for Typescript project

## API-related conventions
Please read root README for TypeSpec and principles/conventions

## Introduction
This is the API folder which contains all the APIs for the project.

The API folder uses the Core folder's `/Core/Api` Type 3 contracts to implement handlers to serve the APIs.
This allows us to bind the types of API params/response to Core folder which in turn are being imported by Web folder to call the APIs. 
This way, we can ensure that the API params/response are consistent across the Core, API, and Web repos.

The general idea of how API folder works is as follows:
- Entry file is `/Api/src/index.ts` where an Express instance is created.
- Routes are added to the Express instance which binds a handler function with its corresponding T3 contract to the Express instance.
  Routes are defined in `/Api/src/Route.ts` and `/Api/src/Route/*`.
  Refer to `/Api/src/Api/PublicApi.ts` and `/Api/src/Api/AuthApi.ts` for implementation details.
- The handler function is a "pure" function that takes the params of the T3 contract and returns an `Result` type of the T3 contract ErrorCode and Payload.
  This allows easy testing of the handler without spinning up the Express instance in test cases.
  Handlers are defined in `/Api/src/Api/*`.
- Handler function uses database functions defined in `/Api/src/Database/*` to interact with the database.

## File Structure
Note that the file structure of API follows closely to FTFC 
`/Core`: The core folder
`/Api/database`: Contains database migrations and seeds
`/Api/src/Api`: This folder contains the API handlers which fulfills the core repo T3 contracts
`/Api/src/App`: This folder contains the transformations of API types to core types
`/Api/src/Data`: Contains all common data types and functions which can be reused in any *API* project
`/Api/src/Database`: Contains all the T2 database row types and functions
`/Api/src/Route`: Contains all the routes for the API which links T3 contracts to API handlers

## TODO
- Add check for duplicated routes in Express
- Devops add example staging/production deployment

## Enhancement
- Switch to Fastify or upgrade to Express 5
