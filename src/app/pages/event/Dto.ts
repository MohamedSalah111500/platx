import { FormGroup } from "@angular/forms";
import { EventFrequencyType, IGetEventResponse } from "./types";

export function mapEvent(form: FormGroup<any>, eventValue:IGetEventResponse) {
  form.patchValue({
    name: eventValue?.name,
    groups: eventValue?.groups.map((i) => i.id),
    students: eventValue?.students.map((i) => i.id),
    staffs: eventValue?.staffs.map((i) => i.id),
    frequency: EventFrequencyType[eventValue.frequencyText],
    endDate: eventValue?.endDate,
    onceDate:eventValue?.onceDate,
    description: eventValue?.description,
    weeklyFrequencyDays: eventValue?.weeklyFrequencyDays,
    locationLink: eventValue?.locationLink,
    onlineMeetingLink: eventValue?.onlineMeetingLink,
    startTime: eventValue?.startTime,
    duration: eventValue?.duration,
    isReminder: eventValue?.isReminder,
    reminderDescription: eventValue?.reminderDescription,
  });
}
