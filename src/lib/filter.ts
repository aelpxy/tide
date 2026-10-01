export const validateFilter = (search: Record<string, unknown>): { filter?: "favorites" } => ({
  filter: search.filter === "favorites" ? "favorites" : undefined,
});
