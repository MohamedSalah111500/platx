export interface QualificationsPayloadPut {
  id: number;
  name: string;
  staffId: number;
  description: null;
  qualificationDocuments: QualificationDocumentPut[];
  qualificationExperiences: QualificationExperiencePut[];
}

interface QualificationExperiencePut {
  id: number;
  placeName: string;
  startDate: string;
  endDate: null;
  isPresent: boolean;
  jobTitle: null;
  responsibility: null;
  qualificationId: number;
  date?: Date[];
}

interface QualificationDocumentPut {
  id: number;
  name: string;
  documentPath: null;
  qualificationId: number;
}


export interface QualificationsPayload {
  name: string;
  staffId: string;
  description: string;
  qualificationDocuments: QualificationDocument[];
  qualificationExperiences: QualificationExperience[];
}

export interface QualificationExperience {
  placeName: string;
  startDate: string;
  endDate: string;
  date?:string[];
  isPresent: boolean;
  jobTitle: null;
  responsibility: null;
}


export interface QualificationDocument {
  name: string;
  documentPath: null;
}

// Chart data
export interface ChartType {
  chart?: any;
  plotOptions?: any;
  dataLabels?: any;
  stroke?: any;
  colors?: any;
  series?: any;
  fill?: any;
  xaxis?: any;
  yaxis?: any;
}
