import { Component, OnInit } from "@angular/core";
import { Grade } from "../../types";
import { generateFileTypesIcons } from "src/app/utiltis/functions";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalData } from "src/app/shared/general-types";
import { AddUnitModelComponent } from "../add-unit-model/add-unit-model.component";
import { AddGradeModelComponent } from "../add-grade-model/add-grade-model.component";

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

  grades: Grade[] = [{ id: 1, name: "First Grade High School" }];
  modalData!: ModalData;

  constructor(private modalService: BsModalService) {}



  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "course", active: true },
    ];
  }

  openUnitModal(mode: string) {
    const initialState: ModalOptions = {
      class: "modal-lg",
      initialState: {
        modalData: { mode },
      },
    };
    this.bsModalRef = this.modalService.show(
      AddUnitModelComponent,
      initialState
    );
  }

  openGradeModal(mode: string) {
    const initialState: ModalOptions = {
      class: "modal-lg",
      initialState: {
        modalData: { mode },
      },
    };
    this.bsModalRef = this.modalService.show(
      AddGradeModelComponent,
      initialState
    );

    this.bsModalRef.onHide.subscribe((res) => {
      let modalData: ModalData = res["initialState"].modalData;
      this.grades.push({ id: 2, name: modalData.dataBack.name })
    });
  }
}
