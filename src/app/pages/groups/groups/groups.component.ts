import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Observable } from "rxjs";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

import { Group } from "../groups.model";
import { Store } from "@ngrx/store";
import { fetchprojectData } from "src/app/store/ProjectsData/project.actions";
import { selectData } from "src/app/store/ProjectsData/project-selector";
import { PageChangedEvent } from "ngx-bootstrap/pagination";

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
  groupData: any;
  // Table data
  content?: any;
  orderes?: any;
  ordersList!: Observable<Group[]>;
  total: Observable<number>;
  page: any = 1;
  endItem: any = 12;


    // Table data
    lists?: any;
    term: any
    currentPage: any;
    joblist: any;
    searchResults: any;

  statData = [
    {
      icon: "bx bx-collection",
      title: "Total Groups",
      value: "68",
    },
    {
      icon: "bx bx-user",
      title: "Total Students",
      value: "854 ",
    },
    {
      icon: "bx bx-package",
      title: "All Classes Today",
      value: "$36,524",
    },
    {
      icon: "bx bx-hourglass",
      title: "Next Class will start after",
      value: "02H : 35Min",
    },
  ];

  constructor(
    private modalService: BsModalService,
    public store: Store,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Groups" },
      { label: "Groups Grid", active: true },
    ];

    this.store.dispatch(fetchprojectData());
    this.store.select(selectData).subscribe((data) => {
      this.groupData = data;
      this.returnedArray = data;
      this.groupData = this.returnedArray.slice(0, 9);
    });
  }



  // fiter job
  searchJob() {
    if (this.term) {
      this.lists = this.groupData.filter((data: any) => {
        return data.title.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.lists = this.groupData
    }

  }

  selectstatus() {
    var status = (document.getElementById('idStatus') as HTMLInputElement).value;
    if (status) {
      this.lists = this.groupData.filter((es: any) => {
        return es.status === status
      })
    } else {
      this.lists = this.groupData
    }

  }

  selectType() {
    var type = (document.getElementById('idType') as HTMLInputElement).value;
    if (type) {
      this.lists = this.groupData.filter((es: any) => {
        return es.type === type
      })
    } else {
      this.lists = this.groupData
    }
  }

  // page change event
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.groupData = this.returnedArray.slice(startItem, this.endItem);
  }
}
