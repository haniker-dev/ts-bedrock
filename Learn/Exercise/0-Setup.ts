/**
 * Ensure your IDE and dev environment are setup properly
 * - Read package.json and ensure you can run tsc, lint and test scripts
 * - Ensure tsc and lint are showing type/lint errors in your IDE
 */

export type User = {
  name: string
  email: string
}

export function getName(user: User): string {
  return user.name
}
