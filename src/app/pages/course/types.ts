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
  gridTitle: string;
  units: Unit[];
}
