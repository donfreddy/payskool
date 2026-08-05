export function getInitials(fullName: string) {
  if (fullName.length === 0) return ""

  // Split the name by spaces
  const names = fullName.split(" ")
  // Extract the first letter of each name and convert it to uppercase
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("")

  return initials
}

export function camelCaseToTitleCase(camelCaseStr: string) {
  const titleCaseStr = camelCaseStr
    .replace(/([A-Z])/g, " $1") // Insert space before uppercase letters
    .replace(/^./, (char) => char.toUpperCase()) // Capitalize the first letter

  return titleCaseStr
}

export function titleCaseToCamelCase(titleCaseStr: string) {
  const camelCaseStr = titleCaseStr
    .toLowerCase() // Convert the entire string to lowercase first
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // Remove spaces and capitalize the following character

  return camelCaseStr
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with "-"
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
}

export function formatFileSize(bytes: number, decimals: number = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1000 // Use 1024 for binary
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function formatFileType(type: string) {
  return type.slice(0, type.lastIndexOf("/"))
}

export function ratingToPercentage(
  rating: number,
  maxRating: number,
  fractionDigits: number = 0
) {
  const value = ((rating / maxRating) * 100).toFixed(fractionDigits)
  const result = value + "%"

  return result
}