import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions, EventClickArg, EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { category } from "../../data";
import { EventService } from "../../services/event.service";
import { CalendarViewType, EventsLookups } from "../../types";
import { formatDateCustomForCalender } from "src/app/utiltis/functions";
import { GroupsService } from "src/app/pages/groups/services/groupsService.service";
import { ManageService } from "src/app/pages/manage/services/manageService.service";

@Component({
  selector: "platx-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @ViewChild("modalShow") modalShow: TemplateRef<any>;
  modalRef?: BsModalRef;
  breadCrumbItems: Array<{}>;
  category: any[];
  editEvent: any;
  calendarEvents: any[];
  calendarOptions: CalendarOptions;
  currentEvents: EventApi[] = [];
  calendarViewType: CalendarViewType = CalendarViewType.Month;
  calendarViewStartDate: string;
  editMode: boolean = false;
  lookups: EventsLookups = {
    groups: [],
    students: [],
    staff: [],
  };

  constructor(
    private modalService: BsModalService,
    private eventService: EventService,
    private groupsService: GroupsService,
    private manageService: ManageService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "Calendar", active: true },
    ];
    this._fetchData();
    this.initializeCalendarOptions();
    this.getAllLookups();
  }

  initializeCalendarOptions() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0!
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: "dayGridMonth,dayGridWeek,dayGridDay",
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
      eventClick: this.openModal.bind(this),
      datesSet: this.handleViewChange.bind(this),
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        meridiem: true,
        hour12: false,
      },
      validRange: {
        //  start: todayStr, // Disable all dates before today
      },
    };
  }

  getAllEventsDetailsHandler(date: string, viewType: number) {
    this.eventService.getAllEventsDetails(date, viewType).subscribe(
      (res) => {
        this.calendarOptions.events = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getAllLookups() {
    this.groupsService
      .getAllGroups(1, 100000)
      .subscribe((res) => (this.lookups.groups = res.items));

    this.manageService
      .getAllStaff(1, 100000)
      .subscribe((res) => (this.lookups.staff = res.items));

    this.manageService
      .getAllStudents(1, 100000)
      .subscribe((res) => (this.lookups.students = res.items));
  }

  handleViewChange(arg: any) {
    this.calendarViewStartDate = formatDateCustomForCalender(arg.startStr);
    switch (arg.view.type) {
      case "dayGridMonth":
        this.calendarViewType = CalendarViewType.Month;
        break;
      case "dayGridWeek":
        this.calendarViewType = CalendarViewType.Week;
        break;
      case "dayGridDay":
        this.calendarViewType = CalendarViewType.Day;
        break;
      default:
        this.calendarViewType = CalendarViewType.Day;
        break;
    }

    this.getAllEventsDetailsHandler(
      this.calendarViewStartDate,
      this.calendarViewType
    );
  }
  eventAction(actionName: string) {
    this.modalService.hide();
    this.getAllEventsDetailsHandler(
      this.calendarViewStartDate,
      this.calendarViewType
    );
  }

  openModal(clickInfo?: any) {
    clickInfo?.el ? (this.editMode = true) : (this.editMode = false);
    console.log(clickInfo);
    this.editEvent = clickInfo;
    this.modalRef = this.modalService.show(this.modalShow, {
      class: "modal-lg",
    });
  }

  private _fetchData() {
    this.category = category;
  }
}
