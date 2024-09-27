import { Component, OnInit, ViewChild } from "@angular/core";
import { Grade, Unit } from "../../types";
import { generateFileTypesIcons } from "src/app/utiltis/functions";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalData } from "src/app/shared/general-types";
import { AddUnitModelComponent } from "../add-unit-model/add-unit-model.component";
import { AddGradeModelComponent } from "../add-grade-model/add-grade-model.component";
import { CourseService } from "../../services/course.service";
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";

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
  modalRef: BsModalRef;
  bsModalRef?: BsModalRef;
  grades!: Grade[];
  unites!: Unit[];
  modalData!: ModalData;

  constructor(
    private modalService: BsModalService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "course", active: true },
    ];

    this.getAllGrades();
  }

  getAllGrades() {
    this.courseService.getGrades().subscribe((res) => {
      this.grades = res;
      this.getUnitsByGradeId(this.grades[0].id);
    });
  }

  getUnitsByGradeId(gradeId: number) {
    this.courseService.getUnitsByGradeId(gradeId).subscribe((res) => {
      this.unites = res;
    });
  }

  selectTab(tabId: number) {
    this.getUnitsByGradeId(tabId);
  }

  openUnitModal(mode: string, gradeId?: number, unit?: Unit) {
    const initialState: ModalOptions = {
      class: "modal-lg",
      initialState: {
        modalData: { mode, gradeId, dataPass: unit },
      },
    };
    this.bsModalRef = this.modalService.show(
      AddUnitModelComponent,
      initialState
    );

    this.bsModalRef.onHide.subscribe((res) => {
      if (!res["initialState"]) return;
      this.getAllGrades();
    });
  }

  openGradeModal(mode: string, grade?: Grade) {
    const initialState: ModalOptions = {
      class: "modal-lg",
      initialState: {
        modalData: { mode, dataPass: grade },
      },
    };
    this.bsModalRef = this.modalService.show(
      AddGradeModelComponent,
      initialState
    );

    this.bsModalRef.onHide.subscribe((res) => {
      if (!res["initialState"]) return;
      this.getAllGrades();
      let modalData: ModalData = res["initialState"].modalData;
      // this.grades.push({ id: 2, name: modalData.dataBack.name });
    });
  }
}
