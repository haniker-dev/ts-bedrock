# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What this is

`ts-bedrock` is the **TypeFirst template** — a monorepo skeleton (Core / Api /
Web) that real projects are started from, not a product itself.

**This repository is PUBLIC.** Nothing in it — code, comments, this file,
commit messages, branch names — names a client, an engagement or a private
project. Patterns learned on private work belong here; the fact that the work
exists does not. Examples take invented anchors, never real ones.

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
  builds (e.g. `esbuild`), which surfaces later as a broken vite. Fix with
  `npm rebuild <pkg>`.
  Do **not** run `npm approve-scripts` — it writes an `allowScripts` block into
  `package.json`, which should never be committed.
- Gates: `npm run tsc` and `npm run lint` (`--deny-warnings`). Tests are
  `npm test`, which needs `npm run external:start` first. `npm run
  lint:strict` adds oxlint's type-aware rules (oxlint-tsgolint); it is not a
  gate and its findings are untriaged.
- **TypeScript 7 ships only the native `tsc`**, no compiler API: code that
  imports `typescript` needs its own nested package pinning TypeScript 5.
- **Lint is oxlint** (`.oxlintrc.json`). The TypeFirst bans oxlint has no
  native rule for are the `typefirst/*` rules in
  `devops/lint/typefirst-plugin.mjs`, loaded as a JS plugin;
  `oxlint --print-config` does not list them. oxlint has no watch mode, so
  `npm start` lints once.
- `typefirst/import-boundaries` sees relative imports only: a tsconfig
  `paths` or package.json `imports` alias crosses the Core/Api/Web boundary
  unreported.
- Branch off `main`; this repo has no `development` branch.

## Coding style

**Exhaustive `switch` over sum types — no `default`.** Switch in a
value-returning function with an EXPLICIT return type and no `default`
branch. Adding a case to the union then makes tsc error (TS2366 "lacks
ending return statement") at every switch that must now handle it — that
error is wanted; a `default` (or fallback return) silently swallows new
cases, so never add one to satisfy the compiler. The check is tsc-only and
fires only on value-returning switches with a declared return type:
void/side-effecting switches and if-chains get no exhaustiveness check, so
prefer the value-returning shape (there is no `assertNever` helper). One
legitimate `default`: dispatching a generic remainder that cannot be
enumerated (see `apiErrorString` in `Web/src/Api.ts`).

```typescript
// Good: no default — adding a variant to Status breaks compilation here
function statusLabel(s: Status): string {
  switch (s._t) {
    case "Active":
      return "Active"
    case "Suspended":
      return "Suspended until " + formatDate(s.until)
  }
}
```

**The stepdown rule.** A file reads top-to-bottom: the supervisor/entry
function at the top, detail helpers below. Retry/control flow is an
explicit loop at the top, not recursion threaded through callbacks.

**Imperative islands.** Perf-critical imperative code (eg. raw video/canvas
rendering) is a module-level function driven from a ref — an explicit
escape hatch, never hooks (the hooks ban is architectural: see the Web
Runtime section of `README.md`; oxlint enforces it).

## Planning convention

Implementation plans are delivered for review BEFORE code, in a fixed
nine-section shape, in dependency order — the plan reads the way the code
compiles. In a TypeFirst repo the type edit IS the plan: types are the
overview, and everything downstream derives from them.

1. Scope of work — the feature/change request, stated simply; plus what is
   explicitly NOT in scope
2. Solution approach — the main idea in a short paragraph, closing with the
   one-sentence invariant the change enforces
3. Types — real code: Core (T1/T3), then storage (T2, DDL as a compact
   column list), then T4/T5
4. Functions — signatures + doc comments, FTFC-placed; a body only where
   the body IS the decision rather than its consequence
5. Call-site deltas — before/after for the few sites that change shape;
   mechanical ones as one-liners
6. Edit order — what tsc will flag, in sequence: start at the type
   everything derives from, then let the compiler walk you through the
   fallout file by file (an edit sequence, not a runtime flow)
7. Illegal states removed — what became unrepresentable
8. Tests as propositions — each test stated as the claim it proves
9. Gates & open items — including what has NOT been verified

Format rules:

- Changed code is shown as UNIFIED DIFFS against the branch (real
  surrounding context from the current files), never as snippets of the end
  state — the reader must see what is removed as much as what is added; new
  files may be shown whole, marked as new
- Keep it short and conceptual: full diffs for types, signatures as a list,
  bodies only where the body is the idea — signal per line is the metric,
  not coverage
- Omit decoders that mirror their type field-for-field; show a decoder only
  when it does something (transform, tagged union, non-obvious
  verify/decode choice)
- No diagrams — the signatures already say it
- The title carries a version (`Plan — <name> (v2)`), incremented on every
  re-delivery, so review comments can name a draft
- Sub-number every item (`7.1`, `7.2`, …) so review comments can reference
  a point instead of quoting it

## Keeping this file useful

If you learn something about this repo that the next developer — or the next
Claude session — would have wanted to know, add it here in the same commit.
