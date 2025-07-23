# A Type-First approach for Typescript project

## Setting up
- Run `npm install` to install dependencies
- Run `npm start` to start the development server
- Read package.json for more scripts

## Web-related conventions
Please read core README for TypeSpec and principles/conventions

Additionally *NEVER* throw in web.

## Introduction
Please read core README for TypeSpec and principles/conventions

The runtime follows closely to The Elm Architecture (TEA) 
where View is pure function of State
and State is only changed on Action (usually triggered from user's interaction or subscription)
[![](https://mermaid.ink/img/pako:eNqNkU1LBDEMhv9KyEWQmYvHIsKgF2_CgJftHso0o4V-SD9WZN3_btrqzu7NHmbaN0_yJuSIS9CEAlNWmZ6MeovKjYc76YFPE0HiXP8SQSWYryPTkk3wIATsGjTAo9P7jk7Sd9gHZi2tGcJaVbg4W4GWD-PDdaUrmJVKvsTgTKL7v-Rv8MVa4Ey4SCCvm3NX-nd3u4eRLZ69yX2oJp-fLfhq6LPr9dakSQD7lETxJoHxmaJq1h2bGjML8IynrWzXuen_tFxn-7WKlII9kO6B-dxUjYyR56KIAzqKThnNuztWUGJ-J8dbEnzVtKpis0TpT4yqksP85RcUORYasHzobdsoVmUTnX4ATcedeg?type=png)](https://mermaid.live/edit#pako:eNqNkU1LBDEMhv9KyEWQmYvHIsKgF2_CgJftHso0o4V-SD9WZN3_btrqzu7NHmbaN0_yJuSIS9CEAlNWmZ6MeovKjYc76YFPE0HiXP8SQSWYryPTkk3wIATsGjTAo9P7jk7Sd9gHZi2tGcJaVbg4W4GWD-PDdaUrmJVKvsTgTKL7v-Rv8MVa4Ey4SCCvm3NX-nd3u4eRLZ69yX2oJp-fLfhq6LPr9dakSQD7lETxJoHxmaJq1h2bGjML8IynrWzXuen_tFxn-7WKlII9kO6B-dxUjYyR56KIAzqKThnNuztWUGJ-J8dbEnzVtKpis0TpT4yqksP85RcUORYasHzobdsoVmUTnX4ATcedeg)

## File Structure
Note that the file structure of API follows closely to FTFC and core repo
`../core`: This should be the ts-bedrock-core repo
`/devops`: Contains scripts for deployment, docker, etc
`/public`: Web assets as per Vite
`/spec`: Test cases
`src/Action`: Contains all the actions
`src/Api`: Contains the API call function which fulfills the core repo T3 contracts
`src/App`: Contains the transformations of web types to core/API types or specific implementations for the project in web
`src/Data`: Contains all common data types and functions which can be reused in any *Web* project
`src/Page`: Contains pages of Web (Generally named after routes)
`src/Route.ts`: Contains all the routes
`src/Runtime`: Contains the runtime files
`src/State`: Contains states of Web
`src/View`: Contains view files which are reusable across Pages
  - Form: Contains form view components Eg: Button, Input, etc
  - Layout: Contains layout view components
  - Theme: Define the theme of the web Eg: spacing, colors, font, etc
  - ImageLocalSrc: Define local images
  - Link: `a` tag with required props to navigate among routes

## TODO
- Refactor Form + Field types
- Add RemoteCache
- Add RemotePage
- Devops add example staging/production deployment
- Add some test cases

## Enhancement
- Use Preact or write our own render library to remove `emit`
