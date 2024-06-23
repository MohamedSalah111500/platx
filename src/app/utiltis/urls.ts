import { environment } from "src/environments/environment";

const AUTH_BASE = "api/Auth/";
const GROUPS_BASE = "api/Groups/";


export const AUTH_URLS = {
  LOGIN: `${environment.apiURL.concat(AUTH_BASE)}login`,
  REGISTRATION: `${environment.apiURL.concat(AUTH_BASE)}register`,
  FORGOT_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}forgot-password`,
  RESET_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}reset-password`,
};

export const GROUPS_URLS = {
  CREATE: `${environment.apiURL.concat(GROUPS_BASE)}`,
  GET: `${environment.apiURL.concat(GROUPS_BASE)}`,
  GET_GROUP: (groupId)=>`${environment.apiURL.concat(GROUPS_BASE)}${groupId}`,
  GET_GROUP_STUDENTS: (groupId)=>`${environment.apiURL.concat(GROUPS_BASE)}${groupId}/students`,
  GET_GROUP_STAFF: (groupId)=>`${environment.apiURL.concat(GROUPS_BASE)}${groupId}/staff`,
  GET_GROUP_FILES: (groupId)=>`${environment.apiURL.concat(GROUPS_BASE)}${groupId}/files`,
};

export const ROLES_URLS = {
  GET_ALL: (pageNumber: number, pageSize: number) => `/api/Roles?page=${pageNumber}&size=${pageSize}`,
  GET_BY_ID: (id: number) => `/api/Roles/${id}`,
  CREATE: `/api/Roles`,
  UPDATE: (id: number) => `/api/Roles/${id}`,
  DELETE: (id: number) => `/api/Roles/${id}`,
};
