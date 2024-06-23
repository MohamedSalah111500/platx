import { FormControl } from "@angular/forms";

export interface CreateEventForm {

  title: FormControl;
//   category: FormControl;
  groupIds: FormControl;
  studentIds: FormControl;
  staffIds: FormControl;
  repeat: FormControl;
  dateTo: FormControl;
  description: FormControl;
  WeekDays: FormControl;
  locationLink: FormControl;
  Onlinemeetinglink	: FormControl;
  eventStartTime: FormControl;
  eventDuration: FormControl;
  hasReminder: FormControl;
  reminderTime: FormControl;
  extraNoteintheReminder: FormControl;
}
