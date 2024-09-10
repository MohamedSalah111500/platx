import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.scss"],
})

/**
 * Utility course component
 */
export class CourseComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  subjectList = [{}, {}, {}, {}, {}, {}];
  constructor() {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "course", active: true },
    ];
  }
}
