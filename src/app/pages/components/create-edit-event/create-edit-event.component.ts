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
import { category, calendarEvents, createEventId } from "../../calendar/data";
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

  formData: FormGroup<CreateEventForm>;
  submitted = false;
  minDate: Date;
  maxDate: Date;
  constructor() {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() );
    this.maxDate.setDate(this.maxDate.getDate() + 7);
  }

  ngOnInit(): void {
    this.formData = new FormGroup<CreateEventForm>({
      title: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(70),
      ]),
      category: new FormControl(null),
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
      //       Has Reminder
      // Reminder Time
      // Extra Note in the Reminder
    });

    if (this.editEvent) {
      // const editEventStart = this.formatDate(this.editEvent.start);
      const editEventEnd = this.formatDate(this.editEvent.end);
      this.formData.patchValue({
        title: this.editEvent.title,
        category: this.editEvent.classNames[0],
        groupIds: this.editEvent.extendedProps.groupIds,
        studentIds: this.editEvent.extendedProps.studentIds,
        staffIds: this.editEvent.extendedProps.staffIds,
        repeat: this.editEvent.extendedProps.repeat,
        dateTo: editEventEnd,
        description: this.editEvent.extendedProps.description,
        WeekDays: this.editEvent.extendedProps.WeekDays,
        locationLink: this.editEvent.extendedProps.locationLink,
        Onlinemeetinglink: this.editEvent.extendedProps.Onlinemeetinglink,
        eventStartTime: this.editEvent.extendedProps.eventStartTime,
        eventDuration: this.editEvent.extendedProps.eventDuration,
      });
      this.formData.controls.repeat.disable();
    }
  }

  get form() {
    return this.formData.controls;
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return [year, month, day].join("-");
  }

  private dateToValidator() {
    return (control) => {
      const dateTo = new Date(control.value);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return dateTo <= maxDate ? null : { max: true };
    };
  }

  saveEvent() {
    // this.submitted = true;
    console.log(this.formData);

    if (this.formData.valid) {
      const eventData = this.formData.value;

      if (this.editEvent) {
        this.editEvent.setProp("title", eventData.title);
        this.editEvent.setProp("classNames", [eventData.category]);
        // this.editEvent.setStart(eventData.dateFrom);
        this.editEvent.setEnd(eventData.dateTo);
        this.editEvent.setExtendedProp("groupIds", eventData.groupIds);
        this.editEvent.setExtendedProp("studentIds", eventData.studentIds);
        this.editEvent.setExtendedProp("staffIds", eventData.staffIds);
        this.editEvent.setExtendedProp("repeat", eventData.repeat);
        this.editEvent.setExtendedProp("description", eventData.description);
        this.editEvent.setExtendedProp("WeekDays", eventData.WeekDays);
        this.editEvent.setExtendedProp("locationLink", eventData.locationLink);
        this.editEvent.setExtendedProp(
          "Onlinemeetinglink",
          eventData.Onlinemeetinglink
        );
        this.editEvent.setExtendedProp(
          "eventStartTime",
          eventData.eventStartTime
        );
        this.editEvent.setExtendedProp(
          "eventDuration",
          eventData.eventDuration
        );
      } else {
        this.newEventDate.view.calendar.addEvent({
          id: createEventId(),
          title: eventData.title,
          start: new Date(),
          end: eventData.dateTo,
          className: eventData.category + " " + "text-white",
          extendedProps: {
            groupIds: eventData.groupIds,
            studentIds: eventData.studentIds,
            staffIds: eventData.staffIds,
            repeat: eventData.repeat,
            description: eventData.description,
            WeekDays: eventData.WeekDays,
            locationLink: eventData.locationLink,
            Onlinemeetinglink: eventData.Onlinemeetinglink,
            eventStartTime: eventData.eventStartTime,
            eventDuration: eventData.eventDuration,
          },
        });
      }

      this.position();
      this.resetForm();
      this.modalRef.hide();
      this.eventSaved.emit();
    } else {
      this.formData.markAllAsTouched();
    }
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
    this.resetForm();
    this.modalRef.hide();
  }

  private resetForm() {
    this.formData.reset({
      title: "",
      category: null,
      groupIds: [],
      studentIds: [],
      staffIds: [],
      repeat: 0,
      // dateFrom: "",
      dateTo: "",
      description: "",
      WeekDays: null,
      locationLink: "",
      Onlinemeetinglink: "",

      eventStartTime: "",
      eventDuration: "",
    });
    // this.submitted = false;
  }

  private position() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Event has been saved",
      showConfirmButton: false,
      timer: 1000,
    });
  }

  onRepeatFrequencyChange(event: any) {
    console.log("Selected item:", event);
    this.formData.controls.WeekDays.reset();
    if (event.id == 0) {
      this.formData.controls.dateTo.removeValidators([]);
    } else
      this.formData.controls.dateTo.addValidators([this.dateToValidator()]);
  }
}

// [disabled]="formData.invalid"
