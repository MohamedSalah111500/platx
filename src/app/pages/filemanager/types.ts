import { FormControl } from "@angular/forms";


export interface GetAllFilesResponse {
  items: FileItem[];
  totalCount: number;
}

export interface GetAllFilesSizeResponse {
  wordSize: null;
  pdfSize: null;
  imageSize: string;
  videoSize: null;
  wordCount: number;
  pdfCount: number;
  imageCount: number;
  videoCount: number;
  linkCount: number;
  linkSize: null;
}
export interface FileItem {
  id: number;
  name: string;
  path: string;
  attachementType: number;
  attachementTypeText: string;
  link: string;
  creationTime: string;
  updateTime: null;
  size: string;
}

export interface CreateFileForm {
  name: FormControl;
  path: FormControl;
  attachmentType: FormControl;
  link: FormControl;
}

export interface CreateFilePayload {
  name: string;
  path: string;
  attachementType: number;
  link: string;
}

