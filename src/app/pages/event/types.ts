import { Group } from "../groups/types";
import { Staff, Student } from "../manage/types";

// Event Data
export interface Event {
  name: string;
  value: string;
}

export interface IEvent {
  id: number;
  name: string;
  description: string;
  locationLink: string;
  startTime: string;
  duration: number;
  date: string;
  oldDate: null;
  onlineMeetingLink: string;
  status: number;
  statusText: string;
  frequencyText: string;
  isReminder: boolean;
  isOnline: boolean;
  reminderDescription: string;
  groupCount: number;
  studentCount: number;
  staffCount: number;
  onceDate?:number[];
  monthlyDay?:number[];
  mainEventId: number;
  weeklyFrequencyDays?: number[];


}

export interface IGetEventResponse {
  id: number;
  name: string;
  description: string;
  locationLink: string;
  startTime: string;
  duration: number;
  date: string;
  endDate: string;
  oldDate: null;
  onlineMeetingLink: string;
  status: number;
  statusText: string;
  frequencyText: string;
  onceDate:number[];
  isReminder: boolean;
  isOnline: boolean;
  reminderDescription: string;
  groupCount: number;
  studentCount: number;
  staffCount: number;
  groups: EventGroup[];
  students: EventStudent[];
  staffs: EventStudent[];
  mainEventId: number;
  weeklyFrequencyDays?: number[];
}

interface EventStudent {
  id: number;
  fullName: string;
}

interface EventGroup {
  id: number;
  name: string;
}

export interface ICreateUpdateEventPayload {
  id?:number;
  name: string;
  description: string;
  locationLink: string;
  frequency: number;
  onceDate: number[];
  monthlyDay: number[];
  startTime: string;
  duration: number;
  startDate: string;
  date?: string;
  endDate: string;
  onlineMeetingLink: string;
  isOnline: boolean;
  weeklyFrequencyDays: number[];
  isReminder: boolean;
  reminderDescription: string;
  groups: number[];
  students: number[];
  staffs: number[];
}


export enum EventFrequencyType {
  Once = 1,
  Weekly,
  Monthly,
}

export enum CalendarViewType {
  Month = 1,
  Week,
  Day,
}

export interface EventsLookups {
  groups: Group[];
  students: Student[];
  staff: Staff[];
}
