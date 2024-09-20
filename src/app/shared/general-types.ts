export interface IGeneralSuccessMessageResponse {
  success: boolean | string;
  message: string;
}

export interface IGeneralErrorMessageResponse {
  errors: boolean | string;
  message: string;
}

export interface ModalData {
  mode?: string;
  dataBack?: any;
}
