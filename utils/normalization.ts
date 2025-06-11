// This function should be exactly the same as in your university route
export function normalizeUniversityName(name: string): string {
  let normalized = name.toLowerCase();
  normalized = normalized.replace(/\([^)]*\)/g, '').trim();
  return normalized;
}

// New helper for course names
export function normalizeCourseName(name: string): string {
  // Similar logic: lowercase and remove content in parentheses
  let normalized = name.toLowerCase();
  normalized = normalized.replace(/\([^)]*\)/g, '').trim();
  return normalized;
}
