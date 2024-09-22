import { Component, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CreateGradeForm } from "../../types";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ModalData } from "src/app/shared/general-types";
import { CourseService } from "../../services/course.service";

@Component({
  selector: "platx-add-grade-model",
  templateUrl: "./add-grade-model.component.html",
})
export class AddGradeModelComponent {
  @Output() eventAction = new EventEmitter<{}>();
  modalData: ModalData;
  submitted: boolean = false;

  gradeForm: FormGroup<CreateGradeForm> = new FormGroup<CreateGradeForm>({
    name: new FormControl("", [Validators.required]),
    description: new FormControl("", []),
  });

  constructor(
    public toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.updateForm({});
  }

  closeModal() {
    this.bsModalRef.hide(); // Close the modal
  }
 
  updateForm(data: any): void {
    // this.gradeForm.patchValue({
    //   id: data.qualification?.id || 0,
    //   name: data.qualification?.name || "",
    // });
  }

  createGradeHandler() {
    this.submitted = true;
    const formData = new FormData();
    formData.append("Name", this.gradeForm.value.name);
    formData.append("Description", this.gradeForm.value.description);
    this.modalData.dataBack = this.gradeForm.value;

    if (this.gradeForm.valid) {
      this.courseService.postCreateGrades(formData).subscribe(
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

  updategradeHandler() {
    let payload: any = this.gradeForm.value;
    this.modalData.dataBack = this.gradeForm.value;
    this.closeModal();

    // if (this.gradeForm.valid) {
    //   this.profileService.updateQualification(payload).subscribe(
    //     (res) => {
    //       this.toastr.success(res.message, "Qualifications");
    //       this.model.hide();
    //     },
    //     (err) => {
    //       this.toastr.error(err.message, "Qualifications");
    //     }
    //   );
    // }
  }

  onSubmit(): void {
    this.modalData.mode == "edit"
      ? this.updategradeHandler()
      : this.createGradeHandler();
  }
}
