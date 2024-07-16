

export interface GetAllFilesResponse {
  items: FileItem[];
  totalCount: number;
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
