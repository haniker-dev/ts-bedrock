# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What this is

`ts-bedrock` is the **TypeFirst template** — a monorepo skeleton (Core / Api /
Web) that real projects are started from, not a product itself. The production
project built on it is the Toppan checkpoint control-panel (`dashboard`), which
is the place to look for how these patterns behave at scale.

`README.md` is the specification and is kept current — read it first. It defines
the five type levels and the exact folder each kind of code belongs in. This
file only adds the things a README does not usually say.

## The rule that decides where code goes

**FTFC — Function follows Type, Type follows File, File follows Context.**

A function that operates on a type lives in that type's file; a file is named
after the type it defines; directories encode context. So `addDays(t: Timestamp,
…)` belongs in `Core/Data/Timestamp.ts`, and `UserRow` belongs in
`Api/src/Database/UserRow.ts`.

The practical consequence when adding a function: **find the type's file first.**
Reaching for a new `utils.ts` is nearly always the wrong move here, and it is the
most common way a change ends up looking foreign to this codebase.

`Core/Data` is for types reusable in *any* project; `Core/App` is for types
specific to this one. Putting a project-specific type in `Core/Data` quietly
breaks the template's purpose.

## Working here

- **Three separate `node_modules`**: run `npm install` in the root, `Api/` and
  `Web/`. This is not an npm workspace. After any dependency change, or for a
  `tsc` error that makes no sense, check `npm ls <pkg>` in both the package and
  the root before treating it as a code bug.
- **npm 11 blocks postinstall scripts.** `npm ci` can silently skip native
  builds (e.g. `esbuild`), which surfaces later as phantom eslint
  `import/no-unresolved` errors or a broken vite. Fix with `npm rebuild <pkg>`.
  Do **not** run `npm approve-scripts` — it writes an `allowScripts` block into
  `package.json`, which should never be committed.
- Gates: `npm run tsc` and `npm run lint` (`--max-warnings=0`). Tests are
  `npm test`, which needs `npm run external:start` first.
- Branch off `main`; this repo has no `development` branch.

## Keeping this file useful

If you learn something about this repo that the next developer — or the next
Claude session — would have wanted to know, add it here in the same commit.
