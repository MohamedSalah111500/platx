import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { BsModalRef, ModalDirective } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { CreateEventForm } from "./types";
import { createEventId } from "../../data";
import {
  generateDaysOfMonth,
  getHourAndMinuteFromDate,
  getKeysFromEnum,
} from "src/app/utiltis/functions";
import {
  EventFrequencyType,
  EventsLookups,
  ICreateUpdateEventPayload,
  IEvent,
  IGetEventResponse,
} from "../../types";
import { EventService } from "../../services/event.service";
import { mapEvent } from "../../Dto";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-edit-event",
  templateUrl: "./create-edit-event.component.html",
  styleUrls: ["./create-edit-event.component.scss"],
})
export class CreateEditEventComponent implements OnInit {
  @Input() modalRef?: BsModalRef;
  @Input() editEvent: any;
  @Input() category: any[];
  @Input() lookups: EventsLookups;
  @Input() editMode: boolean = false;
  disableFormView: boolean = false;

  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  
  @Output() eventAction = new EventEmitter<string>();

  targetEvent!: IEvent;
  getKeysFromEnum = getKeysFromEnum;
  daysOfMonth = generateDaysOfMonth();
  eventFrequencyTypes = EventFrequencyType;
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
    { id: 6, name: "Saturday" },
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
  ];

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
      Validators.max(10),
    ]),
    isReminder: new FormControl(false, []),
    reminderDescription: new FormControl("", []),
  });

  submitted = false;
  minDate: Date;
  maxDate: Date;

  constructor(
    private eventService: EventService,
    public toastr: ToastrService
  ) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 7);
  }

  ngOnInit(): void {
    if (this.editMode) {
      const editEventEnd = this.formatDate(this.editEvent.end);
      this.getEventsDetailsHandler(this.editEvent.event.id);
      this.createEventForm.controls.frequency.disable();
    } else {
      this.createEventForm.enable();
      this.createEventForm.controls.startDate.setValue(this.editEvent?.dateStr);
    }

    if (this.disableFormView) this.createEventForm.disable();
  }

  getEventsDetailsHandler(eventId: number) {
    this.eventService
      .getEventsDetails(eventId)
      .subscribe((res: IGetEventResponse) => {
        if (res) mapEvent(this.createEventForm, res);
        this.targetEvent = res;
        this.disableFormView = true;
        this.createEventForm.disable();
      });
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
    let payload: ICreateUpdateEventPayload = {
      name: value.name,
      description: value.description,
      locationLink: value.locationLink,
      endDate: this.formatDate(value.endDate),
      groups: value.groups,
      students: value.students,
      staffs: value.staffs,
      isOnline: value.isOnline,
      onlineMeetingLink: value.onlineMeetingLink,
      startTime: value?.startTime,
      duration: value.duration,
      isReminder: value.isReminder,
      reminderDescription: value.reminderDescription,
      frequency: value.frequency,
      onceDate: value.onceDate,
      monthlyDay: value.monthlyDay,
      weeklyFrequencyDays: value.weeklyFrequencyDays,
      startDate: value.startDate,
    };
    if (this.editMode) {
      let eventId = this.editEvent.event.id;
      eventId ? (payload.id = eventId) : (payload.id = null);
      payload.onceDate = this.targetEvent?.onceDate;
      payload.monthlyDay = this.targetEvent?.monthlyDay;
      payload.weeklyFrequencyDays = this.targetEvent.weeklyFrequencyDays;
      payload.startDate = this.targetEvent.date;
      payload.date = this.targetEvent.date;
      this.eventService.putUpdateEvent(payload).subscribe();
    } else {
      this.eventService.postCreateEvent(payload).subscribe();
    }

    this.createEventForm.reset();
    this.modalRef.hide();
    this.eventAction.emit("save");
    // } else {
    //   this.createEventForm.markAllAsTouched();
    // }
  }

  deleteEventHandler(mainEventId: number, eventDetailsId: number) {}

  openDeleteModel() {
    this.removeItemModal?.show();
  }

  confirmDelete() {
    let { mainEventId, id } = this.targetEvent;
    this.eventService.deleteEvent(mainEventId, id).subscribe((res) => {
      this.toastr.success("deleted successfully", "Event");
      this.eventAction.emit("delete");
    });

    this.removeItemModal?.hide();
  }

  closeModal() {
    this.createEventForm.reset();
    this.modalRef.hide();
  }

  onFrequencyFrequencyChange(event: any) {}

  toggleEditMode() {
    this.disableFormView = !this.disableFormView;
    if (this.disableFormView) {
      this.createEventForm.disable();
    } else {
      this.createEventForm.enable();
      this.createEventForm.controls.frequency.disable();
      this.createEventForm.controls.onceDate.disable();
      this.createEventForm.controls.weeklyFrequencyDays.disable();
      this.createEventForm.controls.endDate.disable();
    }
  }
}

// [disabled]="createEventForm.invalid"
