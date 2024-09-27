import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CreateGradeForm, Grade, PutGradesPayload } from "../../types";
import { BsModalRef, ModalDirective } from "ngx-bootstrap/modal";
import { ModalData } from "src/app/shared/general-types";
import { CourseService } from "../../services/course.service";

@Component({
  selector: "platx-add-grade-model",
  templateUrl: "./add-grade-model.component.html",
})
export class AddGradeModelComponent {
  @Output() eventAction = new EventEmitter<{}>();
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  modalData: ModalData;
  submitted: boolean = false;

  gradeForm: FormGroup<CreateGradeForm> = new FormGroup<CreateGradeForm>({
    id: new FormControl(null, []),
    name: new FormControl("", [Validators.required]),
    description: new FormControl("", []),
  });

  constructor(
    public toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.modalData.dataPass);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  updateForm(data: Grade): void {
    this.gradeForm.patchValue({
      id: data?.id || 0,
      name: data?.name || "",
      description: data?.description || "",
    });
  }

  createGradeHandler() {
    this.submitted = true;
    const formData = new FormData();
    formData.append("Name", this.gradeForm.value.name);
    formData.append("Description", this.gradeForm.value.description);
    this.modalData.dataBack = this.gradeForm.value;

    if (this.gradeForm.valid) {
      this.courseService.postCreateGrade(formData).subscribe(
        (res) => {
          this.closeModal();
          this.submitted = false;
        },
        (err) => {
          //this.closeModal();
          this.submitted = false;
        }
      );
    }
  }

  updateGradeHandler() {
    let payload: PutGradesPayload = {
      id: this.gradeForm.value.id,
      Name: this.gradeForm.value.name,
      Description: this.gradeForm.value.description,
    };

    if (this.gradeForm.valid) {
      this.courseService.putGrade(payload).subscribe(
        (res) => {
          this.toastr.success(res.message, "Grade");
          this.closeModal();
        },
        (err) => {
          this.toastr.error(err.message, "Grade");
        }
      );
    }
  }

  openDeleteModel() {
    this.removeItemModal?.show();
  }

  confirmDelete() {
    this.deleteGradeHandler(this.gradeForm.value.id);
  }

  deleteGradeHandler(gradeId) {
    this.courseService.deleteGrade(gradeId).subscribe(
      (res) => {
        this.removeItemModal?.hide();
        this.closeModal();
      },
      (err) => {}
    );
  }

  onSubmit(): void {
    this.modalData.mode == "edit"
      ? this.updateGradeHandler()
      : this.createGradeHandler();
  }
}
