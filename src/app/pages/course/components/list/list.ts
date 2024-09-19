import { Component, OnInit } from "@angular/core";
import { Grid } from "../../types";

@Component({
  selector: "app-course",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})

/**
 * Utility course component
 */
export class ListComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  subjectList = [{}, {}, {}, {}, {}, {}];

  grids: Grid[] = [];

  constructor() {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "course", active: true },
    ];
  }
}
