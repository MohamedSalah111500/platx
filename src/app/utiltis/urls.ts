import { environment } from "src/environments/environment";

const AUTH_BASE = "api/Auth/";

export const AUTH_URLS = {
  LOGIN: `${environment.apiURL.concat(AUTH_BASE)}login`,
  REGISTRATION: `${environment.apiURL.concat(AUTH_BASE)}register`,
  FORGOT_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}forgot-password`,
  RESET_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}reset-password`,
};
