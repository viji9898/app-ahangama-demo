export function maskDisplayName(value) {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "Guest";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts.at(-1).charAt(0).toUpperCase()}.`;
}