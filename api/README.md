# A Type-First approach for Typescript project

## Setting up
- Run `npm install` to install all dependencies
- Run `npm run db:start` to start the docker database
- Run `npm run db:migrate` to migrate the database migrations
- Run `npm run db:seed` to seed the database
- Run `npm run test` to run the test cases
- Run `npm run start` to start the server together with `tsc` and `lint`
- Read package.json for more scripts

## API-related conventions
Please read core README for TypeSpec and principles/conventions

## Introduction
This is the API repo which contains all the APIs for the project.
The repo REQUIRES the core repo to be present in the sub directory (ie. `../core`)

The API repo uses the Core repo's `/Api` Type 3 contracts to implement handlers to serve the APIs.
This allows us to bind the types of API params/response to Core repo which in turn are being imported by Web repo to call the APIs. 
This way, we can ensure that the API params/response are consistent across the Core, API, and Web repos.

The general idea of how API repo works is as follows:
- Entry file is `src/index.ts` where an Express instance is created.
- Routes are added to the Express instance which binds a handler function with its corresponding T3 contract to the Express instance.
  Routes are defined in `src/Route.ts` and `src/Route/*`.
  Refer to `src/Api/PublicApi.ts` and `src/Api/AuthApi.ts` for implementation details.
- The handler function is a "pure" function that takes the params of the T3 contract and returns an `Either` type of the T3 contract ErrorCode and Payload.
  This allows easy testing of the handler without spinning up the Express instance in test cases.
  Handlers are defined in `src/Api/*`.
- Handler function uses database functions defined in `src/Database/*` to interact with the database.

## File Structure
Note that the file structure of API follows closely to FTFC and core repo
`../core`: This should be the ts-bedrock-core repo
`/database`: Contains database migrations and seeds
`/devops`: Contains scripts for deployment, docker, etc
`/spec`: Test cases
`src/Api`: This folder contains the API handlers which fulfills the core repo T3 contracts
`src/App`: This folder contains the transformations of API types to core types
`src/Data`: Contains all common data types and functions which can be reused in any *API* project
`src/Database`: Contains all the T2 database row types and functions
`src/Route`: Contains all the routes for the API which links T3 contracts to API handlers

## TODO
- Add check for duplicated routes in Express
- Devops add example staging/production deployment
- Simplify multiple test databases (eg: configuring different ports)

## Enhancement
- Switch to Fastify or upgrade to Express 5
