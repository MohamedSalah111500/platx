import { FileSizes } from "../pages/filemanager/types";

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

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function downloadFileUseURL(url: string): void {
  window.open(url, "_blank");
  URL.revokeObjectURL(url);
}

function parseSize(sizeStr: string): number {
  if (sizeStr.toLowerCase().endsWith("kb")) {
    return parseFloat(sizeStr) * 1024; // Convert KB to bytes
  } else if (sizeStr.toLowerCase().endsWith("mb")) {
    return parseFloat(sizeStr) * 1024 * 1024; // Convert MB to bytes
  } else if (sizeStr.toLowerCase().endsWith("gb")) {
    return parseFloat(sizeStr) * 1024 * 1024 * 1024; // Convert GB to bytes
  }
  return 0;
}

export function calculateTotalSizeInGB(fileSizes: FileSizes): number {
  let totalBytes = 0;

  if (fileSizes.wordSize) {
    totalBytes += parseSize(fileSizes.wordSize);
  }
  if (fileSizes.pdfSize) {
    totalBytes += parseSize(fileSizes.pdfSize);
  }
  if (fileSizes.imageSize) {
    totalBytes += parseSize(fileSizes.imageSize);
  }
  if (fileSizes.videoSize) {
    totalBytes += parseSize(fileSizes.videoSize);
  }

  // Convert total size from bytes to GB
  return totalBytes / (1024 * 1024 * 1024);
}

export function formatStorageUsage(
  usedSizeGB: number,
  totalSizeGB: number
): { usedSizeDisplay: string; usedPercentage: number } {
  let usedSizeDisplay = "";
  let usedPercentage = (usedSizeGB / totalSizeGB) * 100;

  if (usedSizeGB < 1) {
    const usedSizeMB = usedSizeGB * 1024; // Convert GB to MB for display
    usedSizeDisplay = `${usedSizeMB.toFixed(2)} MB`;
  } else {
    usedSizeDisplay = `${usedSizeGB.toFixed(2)} GB`;
  }
  return {
    usedSizeDisplay,
    usedPercentage,
  };
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
