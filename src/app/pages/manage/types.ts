// role.model.ts

import { FormControl } from "@angular/forms";

export interface Role {
  id: number;
  name: string;
  creationTime: string;
  updateTime: string | null;
}

export interface GetAllRolesResponse {
  items: Role[];
  totalCount: number;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  id: number;
  name: string;
}

export interface RoleForm {
  id?: FormControl<number>;
  name: FormControl<string>;
}
