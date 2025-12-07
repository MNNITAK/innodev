// Utility function to merge class names
// Simple version without external dependencies
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}