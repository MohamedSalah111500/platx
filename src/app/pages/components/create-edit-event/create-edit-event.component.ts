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
      title: ["", [Validators.required]],
      category: [null],
      groupIds: [[]],
      studentIds: [[]],
      staffIds: [[]],
      repeat: [0, [Validators.required]],
      dateFrom: ["", [Validators.required]],
      dateTo: ["", [Validators.required]],
    });

    if (this.editEvent) {
      console.log(this.editEvent , this.editEvent._instance.range.start);
      const editEventStart = this.formatDate(this.editEvent.start);
      const editEventEnd = this.formatDate(this.editEvent.end);
      this.formData.patchValue({
        title: this.editEvent.title,
        category: this.editEvent.classNames[0],
        groupIds: this.editEvent.extendedProps.groupIds,
        studentIds: this.editEvent.extendedProps.studentIds,
        staffIds: this.editEvent.extendedProps.staffIds,
        repeat: this.editEvent.extendedProps.repeat,
        dateFrom: editEventStart,
        dateTo: editEventEnd,
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
  saveEvent() {
    console.log(this.formData);
    
    if (this.formData.valid) {
      const title = this.formData.get("title").value;
      const className = this.formData.get("category").value;
      const groupIds = this.formData.get("groupIds").value;
      const studentIds = this.formData.get("studentIds").value;
      const staffIds = this.formData.get("staffIds").value;
      const repeat = this.formData.get("repeat").value;
      const dateFrom = this.formData.get("dateFrom").value;
      const dateTo = this.formData.get("dateTo").value;

      if (this.editEvent) {
        console.log(this.editEvent);
        
        this.editEvent.setProp("title", title);
        this.editEvent.setProp("classNames", className);
        this.editEvent.setStart(dateFrom);
        this.editEvent.setEnd(dateTo);
        this.editEvent.setExtendedProp("groupIds", groupIds);
        this.editEvent.setExtendedProp("studentIds", studentIds);
        this.editEvent.setExtendedProp("staffIds", staffIds);
        this.editEvent.setExtendedProp("repeat", repeat);
      } else {
        this.newEventDate.view.calendar.addEvent({
          id: createEventId(),
          title,
          start: dateFrom,
          end: dateTo,
          className: className + " " + "text-white",
          extendedProps: { groupIds, studentIds, repeat, staffIds }
        });
      }

      this.position();
      this.resetForm();
      this.modalRef.hide();
      this.eventSaved.emit();
    }
    else this.formData.markAllAsTouched()
    this.submitted = true;
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
      category: "",
      groupIds: [],
      studentIds: [],
      staffIds: [],
      repeat: 0,
      dateFrom: "",
      dateTo: "",
    });
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
