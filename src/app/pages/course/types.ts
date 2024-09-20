import { FormControl } from "@angular/forms";

export interface Subject {
  id: string;
  subjectTitle: string;
  orderNumber: number;
}

export interface Unit {
  id: number;
  unitTitle: string;
  orderNumber: number;
  subjects: Subject[];
}

export interface Grade {
  id: number;
  name: string;
  units?: Unit[];
}

export interface CreateGradeForm {
  name: FormControl;
}
