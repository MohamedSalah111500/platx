import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ModalData } from "src/app/shared/general-types";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CourseService } from "../../services/course.service";
import { CreateUnitForm, CreateUpdateUnitPayload, Unit } from "../../types";
import { FilemanagerService } from "src/app/pages/filemanager/services/filemanager.service";
import { FileItem } from "src/app/pages/filemanager/types";

@Component({
  selector: "platx-add-unit-model",
  templateUrl: "./add-unit-model.component.html",
})
export class AddUnitModelComponent {
  modalData: ModalData;
  files: FileItem[];
  debounceTimer: any = null;
  orderList = [
    { id: 1, number: "1" },
    { id: 2, number: "2" },
    { id: 3, number: "3" },
    { id: 4, number: "4" },
    { id: 5, number: "5" },
    { id: 6, number: "6" },
  ];

  submitted: boolean = false;
  unitForm: FormGroup<CreateUnitForm> = new FormGroup<CreateUnitForm>({
    id: new FormControl(null, []),
    name: new FormControl("", [Validators.required]),
    description: new FormControl("", []),
    orderNo: new FormControl(null, [Validators.required]),
    gridId: new FormControl("", []),
    subjects: new FormArray([]),
  });

  constructor(
    private courseService: CourseService,
    private fileService: FilemanagerService,
    public toaster: ToastrService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    console.log(this.modalData);
    if (this.modalData.mode == "edit") {
      this.updateForm(this.modalData.dataPass);
    } else {
      if (this.subjects.length > 0) return;
      this.addUnitSubject();
    }
    this.unitForm.controls.gridId.setValue(this.modalData.gradeId);
    this.getAllFileHandler(100);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  updateForm(data: Unit): void {
    this.unitForm.patchValue({
      id: data?.id || 0,
      name: data?.name || "",
      description: data.description || "",
      orderNo: data?.orderNo || null,
      gridId: data?.gridId || null,
    });
    data.subjects?.forEach((subject: any) => {
      this.addUnitSubject(subject);
    });
  }

  addUnitSubject(subject?: any): void {
    this.subjects.push(
      new FormGroup({
        name: new FormControl(
          subject?.name ? subject.name : "",
          Validators.required
        ),
        orderNo: new FormControl(
          subject?.orderNo ? subject.orderNo : "",
          Validators.required
        ),
        attachementId: new FormControl(
          subject?.attachementId ? subject.attachementId : "",
          Validators.required
        ),
      })
    );
  }

  get subjects(): FormArray {
    return this.unitForm.get("subjects") as FormArray;
  }

  removeUnitSubject(index: number): void {
    this.subjects.removeAt(index);
  }

  searchInFilesFn(searchKey: string): void {
    if (this && this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    // Set a new timeout
    this.debounceTimer = setTimeout(() => {
      this.getAllFileHandler(1000, searchKey);
    }, 1000);
  }

  search(event: any): void {
    let term = event.term.toLocaleLowerCase();
    this.searchInFilesFn(term);
  }

  getAllFileHandler(number: number, searchKey: string = "") {
    this.fileService.getAllFiles(1, number, searchKey).subscribe((res) => {
      this.files = res.items;
    });
  }

  postCreateUnitHandler() {
    this.submitted = true;
    let payload: CreateUpdateUnitPayload = this.unitForm
      .value as CreateUpdateUnitPayload;
    console.log(this.unitForm, "payload");
    if (this.unitForm.valid) {
      this.courseService.postCreateUnit(payload).subscribe(
        (res) => {
          this.toaster.success(res.message, "Unit");
          this.closeModal();
          this.submitted = false;
        },
        (err) => {
          this.toaster.error(err.message, "Unit");
          this.submitted = false;
        }
      );
    }
  }

  updateUnitHandler() {
    this.submitted = true;
    let payload: CreateUpdateUnitPayload = this.unitForm
      .value as CreateUpdateUnitPayload;
    if (this.unitForm.valid) {
      this.courseService.putUpdateUnit(payload).subscribe(
        (res) => {
          this.toaster.success(res.message, "Unit");
          this.closeModal();
          this.submitted = false;
        },
        (err) => {
          this.toaster.error(err.message, "Unit");
          this.submitted = false;
        }
      );
    }
  }

  onSubmit(): void {
    this.modalData.mode == "edit"
      ? this.updateUnitHandler()
      : this.postCreateUnitHandler();
  }
}
