import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newslist',
  templateUrl: './newslist.component.html',
  styleUrls: ['./newslist.component.scss']
})
export class NewslistComponent implements OnInit {

   // bread crumb items
   breadCrumbItems: Array<{}>;
  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'news' }, { label: 'news List', active: true }];

  }

}
