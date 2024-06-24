import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { createEventId } from "../../calendar/data";
import { CreateEventForm } from "./types";

@Component({
  selector: "app-create-edit-event",
  templateUrl: "./create-edit-event.component.html",
  styleUrls: ["./create-edit-event.component.scss"],
})
export class CreateEditEventComponent implements OnInit {
  @Input() modalRef?: BsModalRef;
  @Input() newEventDate: any;
  @Input() editEvent: any;
  @Input() category: any[];

  groups = [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
  ];
  students = [
    { id: 1, name: "Student 1" },
    { id: 2, name: "Student 2" },
  ];
  staff = [
    { id: 1, name: "Staff 1" },
    { id: 2, name: "Staff 2" },
  ];
  repeatFrequency = [
    { id: 0, name: "Once" },
    { id: 1, name: "Weekly" },
    { id: 2, name: "Monthly" },
  ];
  weekdays = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    name: (i + 1).toString(),
  }));

  @Output() eventSaved = new EventEmitter<void>();

  formData: FormGroup;
  submitted = false;
  minDate: Date;
  maxDate: Date;
  editMode = false;
  minTime: string;

  constructor() {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.minTime = new Date().toTimeString().substring(0, 5);
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
        title: new FormControl("", [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(70),
        ]),
        groupIds: new FormControl([], [Validators.required]),
        studentIds: new FormControl([]),
        staffIds: new FormControl([]),
        repeat: new FormControl(0, [Validators.required]),
        dateTo: new FormControl(""),
        description: new FormControl("", [Validators.maxLength(1000)]),
        WeekDays: new FormControl(new Date(), [Validators.required]),
        locationLink: new FormControl("", [
            Validators.pattern(/https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/),
        ]),
        Onlinemeetinglink: new FormControl(null),
        eventStartTime: new FormControl("", [Validators.required]),
        eventDuration: new FormControl("", [
            Validators.required,
            Validators.min(0.15),
            Validators.max(24),
        ]),
        hasReminder: new FormControl(false),
        reminderTime: new FormControl(null),
        extraNoteintheReminder: new FormControl(null),
    });

    if (this.editEvent) {
        const editEventEnd = this.editEvent.end ? this.formatDate(this.editEvent.end) : null;

        this.formData.patchValue({
            title: this.editEvent.title,
            groupIds: this.editEvent.extendedProps.groupIds,
            studentIds: this.editEvent.extendedProps.studentIds,
            staffIds: this.editEvent.extendedProps.staffIds,
            repeat: this.editEvent.extendedProps.repeat,
            dateTo: editEventEnd,
            description: this.editEvent.extendedProps.description,
            WeekDays: this.editEvent.extendedProps.repeat ==0?  new Date(this.editEvent.start) : this.editEvent.extendedProps.WeekDays,
            locationLink: this.editEvent.extendedProps.locationLink,
            Onlinemeetinglink: this.editEvent.extendedProps.Onlinemeetinglink,
            eventStartTime: this.editEvent.extendedProps.eventStartTime,
            eventDuration: this.editEvent.extendedProps.eventDuration,
            hasReminder: this.editEvent.extendedProps.hasReminder,
            reminderTime: this.editEvent.extendedProps.reminderTime,
            extraNoteintheReminder: this.editEvent.extendedProps.extraNoteintheReminder,
        });

        this.editMode = true;
    }
    
}

private findEventById(calendarApi: any, eventId: string): any {
  console.log(calendarApi , eventId);
  
  // Assuming calendarApi is an instance of FullCalendar's Calendar API
  const event = calendarApi.getEventById(eventId);
  return event ? event : null;
}


saveEvent(): void {
  this.submitted = true;

  if (this.formData.valid) {
    const formData = this.formData.value;

    // Extract the date from WeekDays and the time from eventStartTime
    const weekDayDate = new Date(formData.WeekDays);
    const [startHour, startMinute] = formData.eventStartTime.split(':').map(Number);
    const startTime = new Date(
      weekDayDate.getFullYear(),
      weekDayDate.getMonth(),
      weekDayDate.getDate(),
      startHour,
      startMinute
    );
    const endTime = new Date(startTime.getTime() + formData.eventDuration * 3600000);

    // Determine which calendar API to use based on edit mode or new event
    let calendarApi;
    if (this.newEventDate && this.newEventDate.view && this.newEventDate.view.calendar) {
      // Adding a new event or editing with newEventDate available
      calendarApi = this.newEventDate.view.calendar;
    } else if (this.editEvent && this.editEvent.id) {
      // Editing an existing event with editEvent provided
      calendarApi = this.editEvent; // Adjust based on your calendar library structure
    } else {
      console.error('No valid calendar API found for saving event.');
      return;
    }

    // If editing an existing event, find and remove it
    if (this.editEvent && this.editEvent.id) {
      const existingEvent = this.findEventById(calendarApi, this.editEvent.id);
      if (existingEvent) {
        existingEvent.remove();
      } else {
        console.error(`Event with id ${this.editEvent.id} not found in calendar.`);
        // Handle not found scenario, if needed
      }
    }

    // Add the new or updated event(s)
    if (formData.repeat === 0) {
      // Once
      this.createSingleEvent(formData, startTime, endTime, calendarApi);
    } else if (formData.repeat === 1) {
      // Weekly
      this.createRepeatedEvents(formData, startTime, endTime, calendarApi, "weeks", 1);
    } else if (formData.repeat === 2) {
      // Monthly
      this.createRepeatedEvents(formData, startTime, endTime, calendarApi, "months", 1);
    }

    // Reset form and close modal
    this.resetForm();
    this.modalRef?.hide();
    this.eventSaved.emit();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill out all required fields correctly!",
    });
  }
}


private createSingleEvent(formData: any, startTime: Date, endTime: Date, calendarApi: any): void {
  const event = {
    id: this.editEvent ? this.editEvent.id : createEventId(), // Use existing ID if editing, or create new ID
    title: formData.title,
    start: startTime,
    end: endTime,
    extendedProps: {
      groupIds: formData.groupIds,
      studentIds: formData.studentIds,
      staffIds: formData.staffIds,
      repeat: formData.repeat,
      description: formData.description,
      WeekDays: formData.WeekDays,
      locationLink: formData.locationLink,
      Onlinemeetinglink: formData.Onlinemeetinglink,
      eventStartTime: formData.eventStartTime,
      eventDuration: formData.eventDuration,
      hasReminder: formData.hasReminder,
      reminderTime: formData.reminderTime,
      extraNoteintheReminder: formData.extraNoteintheReminder,
    },
    classNames: ["text-white"],
  };

  calendarApi.addEvent(event);
}

private createRepeatedEvents(formData: any, startTime: Date, endTime: Date, calendarApi: any, unit: string, increment: number): void {
  const dateTo = new Date(formData.dateTo); // End of repetition period

  if (formData.repeat === 1) { // Weekly
    const selectedWeekdays = formData.WeekDays; // Assume this is an array of weekdays (0 = Sunday, 1 = Monday, etc.)
    const startWeekday = startTime.getDay();

    for (const weekday of selectedWeekdays) {
      const daysUntilNextWeekday = (weekday + 7 - startWeekday) % 7;
      let currentDate = new Date(startTime);

      currentDate.setDate(startTime.getDate() + daysUntilNextWeekday);
      currentDate.setHours(startTime.getHours(), startTime.getMinutes());

      while (currentDate <= dateTo) {
        this.createSingleEvent(formData, currentDate, new Date(currentDate.getTime() + formData.eventDuration * 3600000), calendarApi);

        // Increment date by one week
        currentDate.setDate(currentDate.getDate() + 7);
      }
    }
  } else if (formData.repeat === 2) { // Monthly
    const selectedDayOfMonth = formData.WeekDays; // Assume this is a single day of the month (1 to 31)
    let currentDate = new Date(startTime);
    currentDate.setHours(startTime.getHours(), startTime.getMinutes());

    while (currentDate <= dateTo) {
      let tempDate = new Date(currentDate);

      // Calculate the correct day of the month
      const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
      tempDate.setDate(Math.min(selectedDayOfMonth, daysInMonth));

      if (tempDate >= currentDate && tempDate <= dateTo) {
        this.createSingleEvent(formData, tempDate, new Date(tempDate.getTime() + formData.eventDuration * 3600000), calendarApi);
      }

      // Increment date by one month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
}




  confirmDelete(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        if (this.editEvent) {
          this.editEvent.remove();
        }
        this.modalRef?.hide();
        Swal.fire("Deleted!", "Event has been deleted.", "success");
        this.eventSaved.emit();
      }
    });
  }

  position(): void {
    setTimeout(() => {
      const allEvents = document.querySelectorAll(
        "td.fc-daygrid-day:not(.fc-day-other)"
      );
      allEvents.forEach((el) => {
        el.classList.remove("last-month");
        el.classList.remove("next-month");
      });
      const lastMonthElements = document.querySelectorAll(
        "td.fc-daygrid-day.fc-day-other:not(.fc-day-next)"
      );
      const nextMonthElements = document.querySelectorAll(
        "td.fc-daygrid-day.fc-day-next"
      );
      lastMonthElements.forEach((el) => {
        el.classList.add("last-month");
      });
      nextMonthElements.forEach((el) => {
        el.classList.add("next-month");
      });
    }, 0);
  }

  resetForm(): void {
    this.submitted = false;
    this.formData.reset();
  }

  onRepeatFrequencyChange(event: any): void {
    this.formData.controls.WeekDays.reset();

    if (event.id === 0) {
      this.formData.controls.dateTo.clearValidators();
    } else {
      this.formData.controls.dateTo.setValidators([this.dateToValidator()]);
    }

    this.formData.controls.dateTo.updateValueAndValidity();
  }

  private formatDate(date: Date): string {
    return date ? date.toISOString().slice(0, 10) : '';
}


  private dateToValidator(): any {
    return (control: FormControl): { [key: string]: boolean } | null => {
      const dateTo = new Date(control.value);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return dateTo <= maxDate ? null : { max: true };
    };
  }

  closeModal(): void {
    this.resetForm();
    this.modalRef?.hide();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.formData.disable();
    } else {
      this.formData.enable();
      this.formData.controls.repeat.disable();
    }
  }
}
