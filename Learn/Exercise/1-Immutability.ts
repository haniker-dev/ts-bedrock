/**
 * Immutability
 *  Mutating data leads to bugs and side-effects
 *  that are very difficult to debug
 *  https://github.com/eslint-functional/eslint-plugin-functional/blob/main/docs/rules/immutable-data.md
 */

// Rewrite this function to be immutable
// Hint: Use Array.map
export function doubleArray(arr: number[]): number[] {
  arr.forEach((value, index) => {
    arr[index] = value * 2
  })
  return arr
}

// Using `let` is definitely a non-immutable way to code
// Rewrite this function to be fully immutable
// Hint: Use Array.reduce
export function sumArray(arr: number[]): number {
  let sum = 0
  arr.forEach((value) => {
    sum += value
  })
  return sum
}

// Rewrite this function to be immutable
// Hint: Use spread operator
export function pushArray(arr: number[], value: number): number[] {
  arr.push(value)
  return arr
}

// Return all elements of the array except the first element
// Rewrite this function to be immutable
// Hint: Use destructuring assignment [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment]
export function tailArray(arr: number[]): number[] {
  arr.shift() // Removes the first element of the array
  return arr
}

// Update object
// Rewrite this function to be immutable
// Hint: Use object spread
type Author = {
  name: string
  age: number
}
export function updateAge(author: Author, newAge: number): Author {
  author.age = newAge
  return author
}

// Delete a key from an object
// Fix this function in an immutable way
// Hint: Create a new object
export function removeAge(author: Author): { name: string } {
  // TS Error: The operand of a 'delete' operator must be optional.
  // delete author.age
  return author
}

// The following code is commented as it will cause linting errors
// Convert object from one shape to another
// Fix this function in an immutable way
// Hint: Create a new object (Why object spread is not recommended?)
// type ProductData = {
//   title: string
//   price: number
// }
// type Product = ProductData & {
//   createdBy: Author
// }
// export function toProduct(productData: ProductData, author: Author): Product {
//   (productData as Product).createdBy = author
//   return productData as Product
// }
