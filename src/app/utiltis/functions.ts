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

export function convertObjectToArray(obj: { [key: number]: string }): any[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: value,
    value: Number(key),
  }));
}

export function getIconClass(mimeType: string): string {
  if (mimeType.includes("document")) mimeType = "application/document";

  switch (mimeType) {
    case "application/pdf":
      return "fa fa-file-pdf text-danger"; 
    case "application/document":
      return "mdi mdi-file-document text-primary "; 
    case "image/png":
    case "image/jpeg":
    case "image/gif":
      return "fa fa-file-image"; 
    case "video/mp4":
    case "video/avi":
    case "video/mpeg":
      return "fa fa-file-video"; 
    case "text/html":
    case "text/plain":
      return "fa fa-file-alt"; 
    default:
      return "fa fa-file"; // Font Awesome default file icon class
  }
}
