import { Group } from "../groups/types";
import { Staff,Student } from "../manage/types";

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
  mainEventId: number;
}

export interface ICreateEventPayload {
  name: string;
  description: string;
  locationLink: string;
  frequency: number;
  onceDate: null;
  monthlyDay: null;
  startTime: string;
  duration: number;
  startDate: string;
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
