import path from "node:path"
import * as JD from "decoders"
import type { ESTree, Plugin, Rule } from "@oxlint/plugins"

type BoundaryOptions = {
  elements: string[]
  rules: { from: string; disallow: string[]; message: string }[]
}

const boundaryOptionsDecoder: JD.Decoder<BoundaryOptions> = JD.object({
  elements: JD.array(JD.string),
  rules: JD.array(
    JD.object({
      from: JD.string,
      disallow: JD.array(JD.string),
      message: JD.string,
    }),
  ),
})

const importBoundaries: Rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "A package imports only the packages its boundary rule allows",
    },
    schema: [
      {
        type: "object",
        properties: {
          elements: { type: "array", items: { type: "string" } },
          rules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: { type: "string" },
                disallow: { type: "array", items: { type: "string" } },
                message: { type: "string" },
              },
              required: ["from", "disallow", "message"],
            },
          },
        },
        required: ["elements", "rules"],
      },
    ],
  },
  create(context) {
    const { elements, rules } = boundaryOptionsDecoder.verify(
      context.options[0],
    )
    const cwd = context.cwd
    const importer = context.filename
    const rule = rules.find(
      (r) => r.from === elementOf(elements, cwd, importer),
    )
    if (rule == null) return {}
    const check = (node: ImportSourceNode) => {
      const source = sourceOf(node)
      if (source == null) return
      const target = relativeImportElement(elements, cwd, importer, source)
      if (target != null && rule.disallow.includes(target)) {
        context.report({ node, message: rule.message })
      }
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    }
  },
}

type ImportSourceNode =
  | ESTree.ImportDeclaration
  | ESTree.ExportNamedDeclaration
  | ESTree.ExportAllDeclaration
  | ESTree.ImportExpression

const elementOf = (
  elements: string[],
  cwd: string,
  absolutePath: string,
): string | null => {
  const first = path.relative(cwd, absolutePath).split(path.sep)[0]
  return first != null && elements.includes(first) ? first : null
}

const relativeImportElement = (
  elements: string[],
  cwd: string,
  importer: string,
  source: string,
): string | null =>
  source.startsWith(".")
    ? elementOf(elements, cwd, path.resolve(path.dirname(importer), source))
    : null

const sourceOf = (node: ImportSourceNode): string | null =>
  node.source != null &&
  node.source.type === "Literal" &&
  typeof node.source.value === "string"
    ? node.source.value
    : null

const noTypePredicate: Rule = {
  meta: {
    type: "problem",
    docs: { description: "Type predicates (`is`) are not allowed" },
  },
  create(context) {
    return {
      TSTypePredicate(node) {
        context.report({
          node,
          message:
            "Type predicates (`is`) are not allowed. Use boolean return types instead.",
        })
      },
    }
  },
}

const noConstAssertion: Rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Const assertions (`as const`, `<const>`) are not allowed",
    },
  },
  create(context) {
    const check = (node: ESTree.TSAsExpression | ESTree.TSTypeAssertion) => {
      const type = node.typeAnnotation
      if (
        type.type === "TSTypeReference" &&
        type.typeName.type === "Identifier" &&
        type.typeName.name === "const"
      ) {
        context.report({
          node,
          message:
            "Type assertions (`as`) are not allowed. Use explicit type annotations instead.",
        })
      }
    }
    return {
      TSAsExpression: check,
      TSTypeAssertion: check,
    }
  },
}

const noReactHookMember: Rule = {
  meta: {
    type: "problem",
    docs: { description: "React hooks (`React.useX`) are not allowed" },
  },
  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "React" &&
          node.property.type === "Identifier" &&
          /^use[A-Z]/.test(node.property.name)
        ) {
          context.report({
            node,
            message:
              "React hooks are forbidden in TypeFirst. Use Action to perform effects.",
          })
        }
      },
    }
  },
}

const plugin: Plugin = {
  meta: { name: "typefirst" },
  rules: {
    "import-boundaries": importBoundaries,
    "no-type-predicate": noTypePredicate,
    "no-const-assertion": noConstAssertion,
    "no-react-hook-member": noReactHookMember,
  },
}

export default plugin
