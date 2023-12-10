import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

import { Group } from '../groups.model';
import { Store } from '@ngrx/store';
import { fetchprojectData } from 'src/app/store/ProjectsData/project.actions';
import { selectData } from 'src/app/store/ProjectsData/project-selector';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-groupsgrid',
  templateUrl: './groupsgrid.component.html',
  styleUrls: ['./groupsgrid.component.scss'],

})

/**
 * Projects-grid component
 */
export class GroupsGridComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  returnedArray: any
  groupData: any
  // Table data
  content?: any;
  orderes?: any;
  ordersList!: Observable<Group[]>;
  total: Observable<number>;
  page: any = 1;
  endItem: any = 12;

   statData = [
    {
        icon: 'bx bx-check-circle',
        title: 'Total Groups',
        value: '68'
    }, {
        icon: 'bx bx-hourglass',
        title: 'Total Students',
        value: '854 '
    }, {
        icon: 'bx bx-package',
        title: 'All Classes Today',
        value: '$36,524'
    }, {
      icon: 'bx bx-package',
      title: 'Total Revenue',
      value: '$36,524'
  }
];

  constructor(private modalService: BsModalService, public store: Store, private formBuilder: UntypedFormBuilder) {

  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Groups' }, { label: 'Groups Grid', active: true }];

    this.store.dispatch(fetchprojectData());
    this.store.select(selectData).subscribe(data => {
      this.groupData = data;
      this.returnedArray = data;
      this.groupData = this.returnedArray.slice(0, 9);
    });
  }


  // page change event
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.groupData = this.returnedArray.slice(startItem, this.endItem);
  }
}
