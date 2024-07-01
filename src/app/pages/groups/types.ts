import { FormControl } from "@angular/forms";

export interface CreateGroupForm {
  description: FormControl;
  icon: FormControl;
  cron: FormControl;
  status: FormControl;
  isActive: FormControl;
}

export interface CreateGroupAPIResponse {
  masseage: string;
}

export interface CreateGroupAPIPayload {
  description: string;
  icon: string;
  cron: string;
  status: number;
  isActive: boolean;
}

export type prettify<T> = {
  [k in keyof T]: T[k];
} & {};

export interface CreateGroupAPIPayload {
  description: string;
  icon: string;
  cron: string;
  status: number;
  isActive: boolean;
}

export interface GetAllGroupsResponse {
  items: Group[];
  totalCount: number;
}

export interface Group {
  id: number;
  description: string;
  icon: string;
  nextDueDate: string;
  nextDueTime: string;
  status: string;
  isActive: boolean;
  studentsIcons: string[];
}

export interface GetAllStudentsResponse  {
  items:Student[];
  totalCount: number;

}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  profilePhoto: string;
  dateOfBirth:Date
}
