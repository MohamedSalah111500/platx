import { environment } from "src/environments/environment";

const AUTH_BASE = "api/Auth/";
const GROUPS_BASE = "api/Groups/";
const ROLES_BASE = "api/Roles";
const STUDENT_BASE = "api/Students";
const STAFF_BASE = "api/Staffs";
const QUALIFICATIONS_BASE = "api/Qualifications";
const FILE_MANAGER_BASE = "api/Attachements";

export const AUTH_URLS = {
  LOGIN: `${environment.apiURL.concat(AUTH_BASE)}login`,
  REGISTRATION: `${environment.apiURL.concat(AUTH_BASE)}register`,
  FORGOT_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}forgot-password`,
  RESET_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}reset-password`,
};

export const GROUPS_URLS = {
  CREATE: `${environment.apiURL.concat(GROUPS_BASE)}`,
  GET: `${environment.apiURL.concat(GROUPS_BASE)}`,
  GET_GROUP: (groupId) => `${environment.apiURL.concat(GROUPS_BASE)}${groupId}`,
  GET_GROUP_STUDENTS: (groupId) =>
    `${environment.apiURL.concat(GROUPS_BASE)}${groupId}/students`,
  GET_GROUP_STAFF: (groupId) =>
    `${environment.apiURL.concat(GROUPS_BASE)}${groupId}/staff`,
  GET_GROUP_FILES: (groupId) =>
    `${environment.apiURL.concat(GROUPS_BASE)}${groupId}/files`,
  PATCH_STUDENT: (groupId: string, studentId: string, newGroupId: string) =>
    `${environment.apiURL.concat(
      GROUPS_BASE
    )}move-student/${groupId}/${studentId}/${newGroupId}`,
  REMOVE_STUDENT_FROM_GROUP: (groupId: string, studentId: number) =>
    `${environment.apiURL.concat(
      GROUPS_BASE
    )}remove-student/${groupId}/${studentId}`,
};

export const ROLES_URLS = {
  GET_ALL: `${environment.apiURL.concat(ROLES_BASE)}`,
  GET_BY_ID: (rolesId: number) =>
    `${environment.apiURL.concat(ROLES_BASE)}/${rolesId}`,
  CREATE: `${environment.apiURL.concat(ROLES_BASE)}`,
  UPDATE: `${environment.apiURL.concat(ROLES_BASE)}`,
  DELETE: (rolesId: number) =>
    `${environment.apiURL.concat(ROLES_BASE)}/${rolesId}`,
};

export const STUDENTS_URLS = {
  CREATE: `${environment.apiURL.concat(STUDENT_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(STUDENT_BASE)}`,
  GET_BY_ID: (id: string) => `${environment.apiURL.concat(STUDENT_BASE)}/${id}`,
  UPDATE: `${environment.apiURL.concat(STUDENT_BASE)}`,
  DELETE: (id: string) => `${environment.apiURL.concat(STUDENT_BASE)}/${id}`,
};

export const STAFF_URLS = {
  CREATE: `${environment.apiURL.concat(STAFF_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(STAFF_BASE)}`,
  GET_BY_ID: (id: string) => `${environment.apiURL.concat(STAFF_BASE)}/${id}`,
  UPDATE: `${environment.apiURL.concat(STAFF_BASE)}`,
  DELETE: (id: string) => `${environment.apiURL.concat(STAFF_BASE)}/${id}`,
};

export const QUALIFICATIONS_URLS = {
  CREATE: `${environment.apiURL.concat(QUALIFICATIONS_BASE)}`,

  // GET_ALL: `${environment.apiURL.concat(QUALIFICATIONS_BASE)}`,
  // GET_BY_ID: (id: string) => `${environment.apiURL.concat(QUALIFICATIONS_BASE)}/${id}`,
  // UPDATE: `${environment.apiURL.concat(QUALIFICATIONS_BASE)}`,
  // DELETE: (id: string) => `${environment.apiURL.concat(QUALIFICATIONS_BASE)}/${id}`,
};

export const FILE_MANAGER_URLS = {
  CREATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_SIZE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}/GetAttachementsSize`,
  UPDATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_DOWNLOAD_FILE: (id: number) =>`${environment.apiURL.concat(FILE_MANAGER_BASE)}/DownloadFile/${id}`,
  DELETE: (id: string) =>`${environment.apiURL.concat(FILE_MANAGER_BASE)}/${id}`,
};
