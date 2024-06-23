import { Component, OnInit} from "@angular/core";
import { Observable } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  UntypedFormBuilder} from "@angular/forms";

import { Store } from "@ngrx/store";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { GroupsService } from "../services/groupsService.service";
import { Group } from "../types";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"],
})

/**
 * Projects-grid component
 */
export class GroupsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  returnedArray: any;
  // Table data
  content?: any;
  orderes?: any;
  ordersList!: Observable<Group[]>;
  total: Observable<number>;

  page: number = 1;
  pageSize: number = 8;

  endItem: any = 12;

  loading:boolean = false;
  groups: Group[] = [];
  totalCount: number=0;

  // Table data
  lists?: any;
  term: any;
  currentPage: any;
  joblist: any;
  searchResults: any;

  statData = [
    {
      icon: "bx bx-collection",
      title: "Total Groups",
      value: 0,
    },
    {
      icon: "bx bx-user",
      title: "Total Students",
      value: 0,
    },
    {
      icon: "bx bx-package",
      title: "All Classes Today",
      value: 0,
    },
    {
      icon: "bx bx-hourglass",
      title: "Next Class will start after",
      value: '0',
    },
  ];

  constructor(
    private modalService: BsModalService,
    private groupsService: GroupsService,
    public store: Store,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Groups" },
      { label: "List", active: true },
    ];

    this.getAllGroups(this.page, this.pageSize);
  }

  getAllGroups(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.groupsService.getAllGroups(pageNumber, pageSize).subscribe(
      (response) => {
        this.groups = response.items;
        this.lists = response.items;
        this.returnedArray = response.items;
        this.totalCount = response.totalCount;
        this.statData[0].value = response.totalCount
        this.statData[1].value = response.totalCount * 20
        this.statData[2].value = response.items.length
        this.statData[3].value = response.items[0].nextDueTime

        console.log("Registration successful:", response);
        this.loading = false;

      },
      (error) => {
        let firstErrorMessage =
          error.error.errors[Object.keys(error.error.errors)[0]];
        // this.error = firstErrorMessage;
        this.loading = false;


      }
    );
  }
  // fiter job
  searchJob() {
    if (this.term) {
      this.groups = this.lists.filter((data: Group) => {
        return data.description.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.groups = this.lists;
    }
  }

  selectstatus() {
    var status = (document.getElementById("idStatus") as HTMLInputElement)
      .value;
    if (status) {
      this.groups = this.lists.filter((es: any) => {
        return es.status === status;
      });
    } else {
      this.groups = this.lists;
    }
  }

  selectType() {
    var type = (document.getElementById("idType") as HTMLInputElement).value;
    if (type) {
      this.groups = this.lists.filter((es: any) => {
        return es.type === type;
      });
    } else {
      this.groups = this.lists;
    }
  }

  // page change event
  pageChanged(event: any): void {
    this.endItem = event.page * event.itemsPerPage;
    this.getAllGroups(event.page, 10);
  }
}
