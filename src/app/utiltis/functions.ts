export function randId(prefix = "id"): string {
  return String(
    Math.random()
      .toString(36)
      .replace("0.", prefix || "")
  );
}

export function pagination(
  url: string,
  pageNumber: number = 1,
  pageSize: number = 10
): string {
  return `${url}?page=${pageNumber}&size=${pageSize}`;
}
