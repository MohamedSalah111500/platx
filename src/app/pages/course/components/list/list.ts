import { Component, OnInit } from "@angular/core";
import { Grid } from "../../types";
import { generateFileTypesIcons } from "src/app/utiltis/functions";

@Component({
  selector: "app-course",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})

/**
 * Utility course component
 */
export class ListComponent implements OnInit {
  generateFileTypesIcons = generateFileTypesIcons;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  subjectList = [{}, {}, {}, {}, {}, {}];

  grids: Grid[] = [
    {id:1,name:"الصف الاول الثانوي"}
  ];

  constructor() {}

  gridModalHandler(event) {
    this.grids.push(event)
    console.log(event);
  }
  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "course", active: true },
    ];
  }
}
