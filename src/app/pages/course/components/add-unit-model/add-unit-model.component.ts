import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ModalData } from "src/app/shared/general-types";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "platx-add-unit-model",
  templateUrl: "./add-unit-model.component.html",
})
export class AddUnitModelComponent {
  modalData: ModalData;

  unitForm: FormGroup;
  orderList = [
    { number: "1" },
    { number: "2" },
    { number: "3" },
    { number: "4" },
    { number: "5" },
  ];

  constructor(private fb: FormBuilder, public toastr: ToastrService,public bsModalRef: BsModalRef) {
    this.unitForm = this.fb.group({
      name: [""],
      staffId: [0, Validators.required],
      description: [""],
      subjects: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.modalData.mode == "edit") {
      this.updateForm({});
    } else {
      if (this.subjects.length > 0) return;
      this.addUnitSubject(); // Add one subject by default
    }
  }
 

  updateForm(data: any): void {
    this.unitForm.patchValue({
      id: data.qualification?.id || 0,
      name: data.qualification?.name || "",
      staffId: data.qualification.staffId || 0,
      description: data.qualification?.description || "",
    });

    data.qualification?.subjects.forEach((experience: any) => {
      this.addUnitSubject(experience);
    });
  }

  get subjects(): FormArray {
    return this.unitForm.get("subjects") as FormArray;
  }

  addUnitSubject(subject?: any): void {
    this.subjects.push(
      this.fb.group({
        id: [subject?.id || null],
        subjectTitle: [subject?.subjectTitle || null],
        document: [subject?.document || null, Validators.required],
        order: [subject?.order || null],
        qualificationId: [subject?.qualificationId || 0],
      })
    );
  }

  removeUnitSubject(index: number): void {
    this.subjects.removeAt(index);
  }

  createQualificationHandler() {
    let payload: any = this.unitForm.value;
    let newExperiences: any[] = payload.subjects.map((qualifiction: any) => ({
      placeName: qualifiction.placeName,
      subjectTitle: qualifiction.subjectTitle,
      responsibility: qualifiction.responsibility,
    }));
    payload.subjects = newExperiences;
    // if (this.unitForm.valid) {
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

  updateQualificationHandler() {
    let payload: any = this.unitForm.value;
    let newExperiences: any[] = payload.subjects.map((qualifiction: any) => ({
      id: qualifiction.id,
      qualificationId: qualifiction.qualificationId,
      placeName: qualifiction.placeName,
      subjectTitle: qualifiction.subjectTitle,
      responsibility: qualifiction.responsibility,
    }));

    payload.subjects = newExperiences;
    // if (this.unitForm.valid) {
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
      ? this.updateQualificationHandler()
      : this.createQualificationHandler();
  }
}
