import { FormControl } from "@angular/forms";

export interface CreateEventForm {
  name: FormControl;
  groups: FormControl;
  students: FormControl;
  staffs: FormControl;
  frequency: FormControl;
  onceDate: FormControl;
  monthlyDay: FormControl;
  startTime: FormControl;
  startDate: FormControl;
  endDate: FormControl;
  description: FormControl;
  weeklyFrequencyDays: FormControl;
  isOnline: FormControl;
  locationLink: FormControl;
  onlineMeetingLink: FormControl;
  duration: FormControl;
  isReminder: FormControl;
  reminderDescription: FormControl;
}
