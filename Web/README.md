# A Type-First approach for Typescript project

## Web-related conventions
Please read root README for TypeSpec and principles/conventions

Additionally *NEVER* throw in web.

## Introduction
Please read core README for TypeSpec and principles/conventions

The runtime follows closely to The Elm Architecture (TEA) 
where View is pure function of State
and State is only changed on Action (usually triggered from user's interaction or subscription)
[![](https://mermaid.ink/img/pako:eNqNkU1LBDEMhv9KyEWQmYvHIsKgF2_CgJftHso0o4V-SD9WZN3_btrqzu7NHmbaN0_yJuSIS9CEAlNWmZ6MeovKjYc76YFPE0HiXP8SQSWYryPTkk3wIATsGjTAo9P7jk7Sd9gHZi2tGcJaVbg4W4GWD-PDdaUrmJVKvsTgTKL7v-Rv8MVa4Ey4SCCvm3NX-nd3u4eRLZ69yX2oJp-fLfhq6LPr9dakSQD7lETxJoHxmaJq1h2bGjML8IynrWzXuen_tFxn-7WKlII9kO6B-dxUjYyR56KIAzqKThnNuztWUGJ-J8dbEnzVtKpis0TpT4yqksP85RcUORYasHzobdsoVmUTnX4ATcedeg?type=png)](https://mermaid.live/edit#pako:eNqNkU1LBDEMhv9KyEWQmYvHIsKgF2_CgJftHso0o4V-SD9WZN3_btrqzu7NHmbaN0_yJuSIS9CEAlNWmZ6MeovKjYc76YFPE0HiXP8SQSWYryPTkk3wIATsGjTAo9P7jk7Sd9gHZi2tGcJaVbg4W4GWD-PDdaUrmJVKvsTgTKL7v-Rv8MVa4Ey4SCCvm3NX-nd3u4eRLZ69yX2oJp-fLfhq6LPr9dakSQD7lETxJoHxmaJq1h2bGjML8IynrWzXuen_tFxn-7WKlII9kO6B-dxUjYyR56KIAzqKThnNuztWUGJ-J8dbEnzVtKpis0TpT4yqksP85RcUORYasHzobdsoVmUTnX4ATcedeg)

## File Structure
Note that the file structure of API follows closely to FTFC and core repo
`/Core`: The core folder
`/web/public`: Web assets as per Vite
`/Web/src/Action`: Contains all the actions
`/Web/src/Api`: Contains the API call function which fulfills the core repo T3 contracts
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

## TODO
- Refactor Form + Field types
- Add RemoteCache
- Add RemotePage
- Devops add example staging/production deployment

## Enhancement
- Use Preact or write our own render library to remove `emit`
