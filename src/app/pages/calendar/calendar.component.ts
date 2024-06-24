import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions, EventClickArg, EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { category, calendarEvents, createEventId } from "./data";
import Swal from "sweetalert2";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  modalRef?: BsModalRef;

  breadCrumbItems: Array<{}>;
  @ViewChild("modalShow") modalShow: TemplateRef<any>;
  @ViewChild("editmodalShow") editmodalShow: TemplateRef<any>;

  category: any[];
  newEventDate: any;
  editEvent: any;
  calendarEvents: any[];

  calendarOptions: CalendarOptions;

  currentEvents: EventApi[] = [];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "Calendar", active: true },
    ];
    this._fetchData();
    this.initializeCalendarOptions();
  }

  initializeCalendarOptions() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0!
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: "dayGridMonth,timeGridWeek,timeGridDay", //dayGridWeek,dayGridDay,
        center: "title",
        right: "prevYear,prev,next,nextYear",
      },
      initialView: "dayGridMonth",
      themeSystem: "bootstrap",
      initialEvents: this.calendarEvents,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      dateClick: this.openModal.bind(this),
      eventClick: this.handleformEdit.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        meridiem: false,
        hour12: true,
      },
      validRange: {
        start: todayStr, // Disable all dates before today
      },
    };
  }

  handleformEdit(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;
    this.modalRef = this.modalService.show(this.editmodalShow);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  openModal(event?: any) {
    this.newEventDate = event;
    this.modalRef = this.modalService.show(this.modalShow);
  }

  private _fetchData() {
    this.category = category;
    this.calendarEvents = calendarEvents;
  }

  dropList(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
  }

  listItems = ["Event 1", "Event 2", "Event 3"];

  handleDrop(event: any): void {
    this.calendarEvents.push({
      title: event.item.data,
      date: event.dateStr,
    });
  }
}
