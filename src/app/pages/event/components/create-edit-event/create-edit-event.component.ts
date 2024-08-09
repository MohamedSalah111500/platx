import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { CreateEventForm } from "./types";
import { createEventId } from "../../data";
import { getHourAndMinuteFromDate, getKeysFromEnum } from "src/app/utiltis/functions";
import {
  EventFrequencyType,
  EventsLookups,
  ICreateEventPayload,
} from "../../types";
import { EventService } from "../../services/event.service";

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
  @Input() lookups: EventsLookups;

  eventFrequencyTypes = EventFrequencyType;

  getKeysFromEnum = getKeysFromEnum;

  frequencyFrequencyLookups = [
    {
      id: EventFrequencyType.Once,
      name: getKeysFromEnum(EventFrequencyType)[0],
    },
    {
      id: EventFrequencyType.Weekly,
      name: getKeysFromEnum(EventFrequencyType)[1],
    },
    {
      id: EventFrequencyType.Monthly,
      name: getKeysFromEnum(EventFrequencyType)[2],
    },
  ];
  weeklyFrequencyDays = [
    { id: 0, name: "Saturday" },
    { id: 1, name: "Sunday" },
    { id: 2, name: "Monday" },
    { id: 3, name: "Tuesday" },
    { id: 4, name: "Wednesday" },
    { id: 5, name: "Thursday" },
    { id: 6, name: "Friday" },
  ];

  daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    name: (i + 1).toString(),
  }));

  @Output() eventSaved = new EventEmitter<void>();

  createEventForm: FormGroup<CreateEventForm> = new FormGroup<CreateEventForm>({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(70),
    ]),
    groups: new FormControl([], [Validators.required]),
    students: new FormControl([]),
    staffs: new FormControl([]),
    frequency: new FormControl(1, [Validators.required]),
    onceDate: new FormControl(null, [Validators.required]),
    monthlyDay: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(""),
    description: new FormControl("", [Validators.maxLength(1000)]),
    weeklyFrequencyDays: new FormControl(null, [Validators.required]),
    isOnline: new FormControl(false, []),
    locationLink: new FormControl("", [
      Validators.pattern(/https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/),
    ]),
    onlineMeetingLink: new FormControl(null),
    startTime: new FormControl("", [Validators.required]),
    duration: new FormControl("", [
      Validators.required,
      Validators.min(0.15),
      Validators.max(24),
    ]),
    isReminder: new FormControl(null),
    reminderDescription: new FormControl(null),
  });
  submitted = false;
  minDate: Date;
  maxDate: Date;
  editMode: boolean = false;

  constructor(private eventService: EventService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 7);
  }

  ngOnInit(): void {
    this.createEventForm.controls.startDate.setValue(this.newEventDate?.dateStr);
    
    if (this.editEvent) {
      // const editEventStart = this.formatDate(this.editEvent.start);
      const editEventEnd = this.formatDate(this.editEvent.end);
      this.createEventForm.patchValue({
        name: this.editEvent.name,
        groups: this.editEvent.extendedProps.groups,
        students: this.editEvent.extendedProps.students,
        staffs: this.editEvent.extendedProps.staffs,
        frequency: this.editEvent.extendedProps.frequency,
        endDate: editEventEnd,
        description: this.editEvent.extendedProps.description,
        weeklyFrequencyDays: this.editEvent.extendedProps.weeklyFrequencyDays,
        locationLink: this.editEvent.extendedProps.locationLink,
        onlineMeetingLink: this.editEvent.extendedProps.onlineMeetingLink,
        startTime: this.editEvent.extendedProps.startTime,
        duration: this.editEvent.extendedProps.duration,
        isReminder: this.editEvent.extendedProps.isReminder,
        reminderDescription: this.editEvent.extendedProps.reminderDescription,
      });
      // this.createEventForm.controls.frequency.disable();
      if (!this.editMode) this.createEventForm.disable();
      else {
        this.createEventForm.enable();
        this.createEventForm.controls.frequency.disable();
      }
    }
  }

  get form() {
    return this.createEventForm.controls;
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return [year, month, day].join("-");
  }

  private endDateValidator() {
    return (control) => {
      const endDate = new Date(control.value);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return endDate <= maxDate ? null : { max: true };
    };
  }

  saveEvent() {
    this.submitted = true;
    // if (this.createEventForm.valid) {
    const { value, valid } = this.createEventForm;

    if (this.editEvent) {
      this.editEvent.setProp("title", value.name);
      // this.editEvent.setProp("classNames", [value.category]);
      // this.editEvent.setStart(value.dateFrom);
      this.editEvent.setEnd(value.endDate);
      this.editEvent.setExtendedProp("groups", value.groups);
      this.editEvent.setExtendedProp("students", value.students);
      this.editEvent.setExtendedProp("staffs", value.staffs);
      this.editEvent.setExtendedProp("frequency", value.frequency);
      this.editEvent.setExtendedProp("description", value.description);
      this.editEvent.setExtendedProp(
        "weeklyFrequencyDays",
        value.weeklyFrequencyDays
      );
      this.editEvent.setExtendedProp("locationLink", value.locationLink);
      this.editEvent.setExtendedProp(
        "onlineMeetingLink",
        value.onlineMeetingLink
      );
      this.editEvent.setExtendedProp("startTime", value.startTime);
      this.editEvent.setExtendedProp("duration", value.duration);
      this.editEvent.setExtendedProp("isReminder", value.isReminder);
      this.editEvent.setExtendedProp(
        "reminderDescription",
        value.reminderDescription
      );
    } else {
      let payload: ICreateEventPayload = {
        name: value.name,
        description: value.description,
        locationLink: value.locationLink,
        frequency: value.frequency,
        onceDate: value.onceDate,
        monthlyDay: value.monthlyDay,
        weeklyFrequencyDays: value.weeklyFrequencyDays,
        startDate: value.startDate,
        endDate: this.formatDate(value.endDate),
        groups: value.groups,
        students: value.students,
        staffs: value.staffs,
        isOnline: value.isOnline,
        onlineMeetingLink: value.onlineMeetingLink,
        startTime: getHourAndMinuteFromDate(value.startTime),
        duration: value.duration,
        isReminder: value.isReminder,
        reminderDescription: value.reminderDescription,
      };
      this.eventService.postCreateEvent(payload).subscribe((res) => {
        console.log(res);
      });
    }

    // this.resetForm();
    // this.modalRef.hide();
    // this.eventSaved.emit();
    // } else {
    //   this.createEventForm.markAllAsTouched();
    // }
  }

  confirmDelete() {
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
        this.editEvent.remove();
        this.modalRef.hide();
        Swal.fire("Deleted!", "Event has been deleted.", "success");
        this.eventSaved.emit();
      }
    });
  }

  closeModal() {
    this.createEventForm.reset();
    this.modalRef.hide();
  }

  onFrequencyFrequencyChange(event: any) {}

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) this.createEventForm.disable();
    else {
      this.createEventForm.enable();
      this.createEventForm.controls.frequency.disable();
    }
  }
}

// [disabled]="createEventForm.invalid"
