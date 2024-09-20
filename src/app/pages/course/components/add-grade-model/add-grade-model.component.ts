import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
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

@Component({
  selector: "platx-add-grade-model",
  templateUrl: "./add-grade-model.component.html",
})
export class AddGradeModelComponent {
  modalData: ModalData;
  @Output() eventAction = new EventEmitter<{}>();

  gradeForm: FormGroup<CreateGradeForm> = new FormGroup<CreateGradeForm>({
    name: new FormControl("", [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    public bsModalRef: BsModalRef
  ) {
    this.gradeForm = this.fb.group({
      name: [""],
    });
  }

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

  creategradeHandler() {
    let payload: any = this.gradeForm.value;
    this.modalData.dataBack = this.gradeForm.value;
    this.closeModal();
    // if (this.gradeForm.valid) {
    //   this.profileService.createQualification(payload).subscribe(
    //     (res) => {
    //       this.toastr.success(res.message, "Qualification");
    //       this.model.hide();
    //     },
    //     (err) => {
    //       this.toastr.error(err.message, "Qualification");
    //     }
    //   );
    // }
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
      : this.creategradeHandler();
  }
}
