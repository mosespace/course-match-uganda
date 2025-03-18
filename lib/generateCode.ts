export function generateCode(phrase: string): string {
  return phrase
    .split(/\s+/) // Split by spaces
    .map((word) => word.charAt(0).toUpperCase()) // Take the first letter and uppercase it
    .join(''); // Join letters into a string
}
