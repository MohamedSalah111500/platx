// import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef, ElementRef } from '@angular/core';
// import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
// import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';;
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { category, calendarEvents, createEventId } from './data';

// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-calendar',
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.scss'],
//   encapsulation: ViewEncapsulation.None,
// })
// export class CalendarComponent implements OnInit {

//   modalRef?: BsModalRef;

//   // bread crumb items
//   breadCrumbItems: Array<{}>;

//   @ViewChild('modalShow') modalShow: TemplateRef<any>;
//   @ViewChild('editmodalShow') editmodalShow: TemplateRef<any>;

//   formEditData: UntypedFormGroup;
//   submitted = false;
//   category: any[];
//   newEventDate: any;
//   editEvent: any;
//   calendarEvents: any[];
//   // event form
//   formData: UntypedFormGroup;

//   calendarOptions: CalendarOptions = {
//     plugins: [
//       interactionPlugin,
//       dayGridPlugin,
//       timeGridPlugin,
//       listPlugin,
//     ],
//     headerToolbar: {
//       left: 'dayGridMonth,dayGridWeek,dayGridDay',
//       center: 'title',
//       right: 'prevYear,prev,next,nextYear'
//     },
//     initialView: "dayGridMonth",
//     themeSystem: "bootstrap",
//     initialEvents: calendarEvents,
//     weekends: true,
//     editable: true,
//     selectable: true,
//     selectMirror: true,
//     dayMaxEvents: true,
//     dateClick: this.openModal.bind(this),
//     eventClick: this.handleEventClick.bind(this),
//     eventsSet: this.handleEvents.bind(this),
//     eventTimeFormat: { // like '14:30:00'
//       hour: '2-digit',
//       minute: '2-digit',
//       meridiem: false,
//       hour12: true
//     }
//   };
//   currentEvents: EventApi[] = [];

//   ngOnInit(): void {
//     this.breadCrumbItems = [{ label: 'platx' }, { label: 'Calendar', active: true }];

//     this.formData = this.formBuilder.group({
//       title: ['', [Validators.required]],
//       category: ['', [Validators.required]],
//     });

//     this.formEditData = this.formBuilder.group({
//       editTitle: ['', [Validators.required]],
//       editCategory: [],
//     });
//     this._fetchData();

//   }

//   /**
//    * Event click modal show
//    */
//   handleEventClick(clickInfo: EventClickArg) {
//     this.editEvent = clickInfo.event;
//     var category = clickInfo.event.classNames;
//     this.formEditData = this.formBuilder.group({
//       editTitle: clickInfo.event.title,
//       editCategory: category instanceof Array ? clickInfo.event.classNames[0] : clickInfo.event.classNames,
//     });
//     this.modalRef = this.modalService.show(this.editmodalShow);
//   }

//   /**
//    * Events bind in calander
//    * @param events events
//    */
//   handleEvents(events: EventApi[]) {
//     console.log(events);

//     this.currentEvents = events;

//   }

//   constructor(
//     private modalService: BsModalService,
//     private formBuilder: UntypedFormBuilder
//   ) { }

//   get form() {
//     return this.formData.controls;
//   }

//   /**
//    * Delete-confirm
//    */
//   confirm() {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'You won\'t be able to revert this!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#34c38f',
//       cancelButtonColor: '#f46a6a',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.value) {
//         this.deleteEventData();
//         Swal.fire('Deleted!', 'Event has been deleted.', 'success');
//       }
//     });
//   }

//   position() {
//     Swal.fire({
//       position: 'center',
//       icon: 'success',
//       title: 'Event has been saved',
//       showConfirmButton: false,
//       timer: 1000,
//     });
//   }

//   /**
//    * Event add modal
//    */
//   openModal(event?: any) {
//     this.newEventDate = event;
//     this.modalRef = this.modalService.show(this.modalShow);
//   }

//   /**
//    * save edit event data
//    */
//   editEventSave() {
//     const editTitle = this.formEditData.get('editTitle').value;
//     const editCategory = this.formEditData.get('editCategory').value;

//     const editId = this.calendarEvents.findIndex(
//       (x) => x.id + '' === this.editEvent.id + ''
//     );

//     this.editEvent.setProp('title', editTitle);
//     this.editEvent.setProp('classNames', editCategory);

//     this.calendarEvents[editId] = {
//       ...this.editEvent,
//       title: editTitle,
//       id: this.editEvent.id,
//       classNames: editCategory + ' ' + 'text-white',
//     };

//     this.position();
//     this.formEditData = this.formBuilder.group({
//       editTitle: '',
//       editCategory: '',
//     });
//     this.modalService.hide();
//   }

//   /**
//    * Delete event
//    */
//   deleteEventData() {
//     this.editEvent.remove();
//     this.modalService.hide();
//   }

//   /**
//    * Close event modal
//    */
//   closeEventModal() {
//     this.formData = this.formBuilder.group({
//       title: '',
//       category: '',
//     });
//     this.modalService.hide();
//   }

//   /**
//    * Save the event
//    */
//   saveEvent() {
//     if (this.formData.valid) {
//       const title = this.formData.get('title').value;
//       const className = this.formData.get('category').value;
//       const calendarApi = this.newEventDate.view.calendar;
//       calendarApi.addEvent({
//         id: createEventId(),
//         title,
//         start: this.newEventDate.date,
//         end: this.newEventDate.date,
//         className: className + ' ' + 'text-white'
//       });
//       this.position();
//       this.formData = this.formBuilder.group({
//         title: '',
//         category: '',
//       });
//       this.modalService.hide();
//     }
//     this.submitted = true;
//   }

//   /**
//    * Fetches the data
//    */
//   private _fetchData() {
//     // Event category
//     this.category = category;
//     // Calender Event Data
//     this.calendarEvents = calendarEvents;
//     // form submit
//     this.submitted = false;
//   }

//   dropList(event: CdkDragDrop<string[]>): void {
//     moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
//   }
//   listItems = ['Event 1', 'Event 2', 'Event 3'];
//   handleDrop(event: any): void {
//     this.calendarEvents.push({
//       title: event.item.data,
//       date: event.dateStr,
//     });
//   }
// }
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
  ElementRef,
} from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
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

  // bread crumb items
  breadCrumbItems: Array<{}>;

  @ViewChild("modalShow") modalShow: TemplateRef<any>;
  @ViewChild("editmodalShow") editmodalShow: TemplateRef<any>;

  formEditData: UntypedFormGroup;
  submitted = false;
  category: any[];
  newEventDate: any;
  editEvent: any;
  calendarEvents: any[];
  // event form
  formData: UntypedFormGroup;

  // New arrays for groups, students, staff, and repeat frequency
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
    { id: 0, name: "Never" },
    { id: 1, name: "Daily" },
    { id: 2, name: "Weekly" },
  ];

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: "dayGridMonth,dayGridWeek,dayGridDay",
      center: "title",
      right: "prevYear,prev,next,nextYear",
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    initialEvents: calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventTimeFormat: {
      // like '14:30:00'
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
      hour12: true,
    },
  };
  currentEvents: EventApi[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "Calendar", active: true },
    ];

    this.formData = this.formBuilder.group({
      title: ["", [Validators.required]],
      category: [""],
      groupIds: [[]],
      studentIds: [[]],
      staffIds: [[]],

      repeat: [0, [Validators.required]],
      dateFrom: ["", [Validators.required]],
      dateTo: ["", [Validators.required]],
    });

    this.formEditData = this.formBuilder.group({
      editTitle: ["", [Validators.required]],
      editCategory: [""],
      editGroupIds: [[]],
      editStudentIds: [[]],
      editstaffIds: [[]],

      editRepeat: [0, [Validators.required]],
      editDateFrom: ["", [Validators.required]],
      editDateTo: ["", [Validators.required]],
    });
    this._fetchData();
  }

  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo);
    
    this.editEvent = clickInfo.event;
    var category = clickInfo.event.classNames;
    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory:
        category instanceof Array
          ? clickInfo.event.classNames[0]
          : clickInfo.event.classNames,
      editGroupIds: [], // Add logic to retrieve existing values
      editStudentIds: [], // Add logic to retrieve existing values
      editRepeat: 0, // Add logic to retrieve existing values
      // staffIds
      editstaffIds: [[]],
      editDateFrom: clickInfo.event.start,
      editDateTo: clickInfo.event.end,
    });
    this.modalRef = this.modalService.show(this.editmodalShow);
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    console.log(events);
    this.currentEvents = events;
  }

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder
  ) {}

  get form() {
    return this.formData.controls;
  }

  /**
   * Delete-confirm
   */
  confirm() {
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
        this.deleteEventData();
        Swal.fire("Deleted!", "Event has been deleted.", "success");
      }
    });
  }

  position() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Event has been saved",
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Event add modal
   */
  openModal(event?: any) {
    this.newEventDate = event;
    this.modalRef = this.modalService.show(this.modalShow);
  }

  /**
   * save edit event data
   */
  editEventSave() {
    const editTitle = this.formEditData.get("editTitle").value;
    const editCategory = this.formEditData.get("editCategory").value;
    const editGroupIds = this.formEditData.get("editGroupIds").value;
    const editStudentIds = this.formEditData.get("editStudentIds").value;
    const editstaffIds = this.formEditData.get("editstaffIds").value;
    const editRepeat = this.formEditData.get("editRepeat").value;
    const editDateFrom = this.formEditData.get("editDateFrom").value;
    const editDateTo = this.formEditData.get("editDateTo").value;

    const editId = this.calendarEvents.findIndex(
      (x) => x.id + "" === this.editEvent.id + ""
    );

    this.editEvent.setProp("title", editTitle);
    this.editEvent.setProp("classNames", editCategory);

    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id: this.editEvent.id,
      classNames: editCategory + " " + "text-white",
      groupIds: editGroupIds,
      studentIds: editStudentIds,
      staffIds: editstaffIds,
      repeat: editRepeat,
      dateFrom: editDateFrom,
      dateTo: editDateTo,
    };

    this.position();
    this.formEditData = this.formBuilder.group({
      editTitle: "",
      editCategory: "",
      editGroupIds: [],
      editStudentIds: [],
      editstaffIds: [],
      editRepeat: 0,
      editDateFrom: "",
      editDateTo: "",
    });
    this.modalService.hide();
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.hide();
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: "",
      category: "",
      groupIds: [],
      studentIds: [],

      staffIds: [],
      repeat: 0,
      dateFrom: "",
      dateTo: "",
    });
    this.modalService.hide();
  }

  /**
   * Save the event
   */
  saveEvent() {
    if (this.formData.valid) {
      const title = this.formData.get("title").value;
      const className = this.formData.get("category").value;
      const groupIds = this.formData.get("groupIds").value;
      const studentIds = this.formData.get("studentIds").value;
      const repeat = this.formData.get("repeat").value;
      const dateFrom = this.formData.get("dateFrom").value;
      const dateTo = this.formData.get("dateTo").value;
      const calendarApi = this.newEventDate.view.calendar;
      console.log(dateFrom, dateTo);
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: dateFrom,
        end: dateTo,
        // start: this.newEventDate.date,
        //  end: this.newEventDate.date,
        className: className + " " + "text-white",
        extendedProps: {
          groupIds,
          studentIds,
          repeat,
        },
      });
      this.position();
      this.formData = this.formBuilder.group({
        title: "",
        category: "",
        groupIds: [],
        studentIds: [],
        staffIds: [],

        repeat: 0,
        dateFrom: "",
        dateTo: "",
      });
      this.modalService.hide();
    }
    this.submitted = true;
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    // Event category
    this.category = category;
    // Calender Event Data
    this.calendarEvents = calendarEvents;
    // form submit
    this.submitted = false;
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
