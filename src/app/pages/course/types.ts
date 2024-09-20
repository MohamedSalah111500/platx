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

export interface Grid {
  id: number;
  name: string;
  units?: Unit[];
}

export interface CreateGridForm {
  name: FormControl;
}
