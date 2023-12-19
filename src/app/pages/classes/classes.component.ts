import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-classes",
  templateUrl: "./classes.component.html",
  styleUrls: ["./classes.component.scss"],
})

/**
 * Utility classes component
 */
export class ClassesComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  subjectList = [{}, {}, {}, {}, {}, {}];
  constructor() {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "classes", active: true },
    ];
  }
}
