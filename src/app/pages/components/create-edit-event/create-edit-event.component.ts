import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { category, calendarEvents, createEventId } from "../../calendar/data";

@Component({
  selector: 'app-create-edit-event',
  templateUrl: './create-edit-event.component.html',
  styleUrls: ['./create-edit-event.component.css']
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

  @Output() eventSaved = new EventEmitter<void>();

  formData: UntypedFormGroup;
  submitted = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      category: [null],
      groupIds: [[], [Validators.required]],
      studentIds: [[]],
      staffIds: [[]],
      repeat: [0, [Validators.required]],
      dateTo: ["", [this.dateToValidator()]],
      description: ["", [Validators.maxLength(1000)]],
      WeekDays: ["", [Validators.maxLength(1000)]],
      locationLink: ["", [Validators.pattern(/https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)]],
      eventStartTime: ["", [Validators.required]],
      eventDuration: ["", [Validators.required, Validators.min(0.15), Validators.max(24)]],
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
        eventStartTime: this.editEvent.extendedProps.eventStartTime,
        eventDuration: this.editEvent.extendedProps.eventDuration,
      });
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
    this.submitted = true;

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
        this.editEvent.setExtendedProp("eventStartTime", eventData.eventStartTime);
        this.editEvent.setExtendedProp("eventDuration", eventData.eventDuration);
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
      confirmButtonText: "Yes, delete it!"
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
      WeekDays:null,
      locationLink: "",
      eventStartTime: "",
      eventDuration: "",
    });
    this.submitted = false;
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
}
