import { FormControl } from "@angular/forms";

export interface Grade {
  id: number;
  name: string;
  description: string;
  units?: Unit[];
}
export interface CreateGradeForm {
  name: FormControl;
  description: FormControl;
}

export interface CreateGrades {
  Name: string;
  Description: string;
}

export interface CreateGradePayload extends CreateGrades {}
export interface GetGradeResponse {
  items: Grade[];
}

export interface Subject {
  id: number;
  name: string;
  orderNo: number;
  unitId: number;
  attachementId: number;
  creationTime: string;
}

export interface Unit {
  id: number;
  unitTitle: string;
  orderNumber: number;
  subjects: Subject[];
}

export interface Units {
  id: number;
  name: string;
  orderNo: number;
  description: string;
  gridId: number;
  creationTime: string;
  subjects: Subject[];
}

export interface GetUnitsInGradeResponse extends Units {}
