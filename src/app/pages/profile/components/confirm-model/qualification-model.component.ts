import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  QualificationExperience,
  QualificationsPayload,
  QualificationsPayloadPut,
  QualificationExperiencePut,
  StaffResponse,
} from "../../types";
import { ProfileService } from "../../services/profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "platx-qualification-model",
  templateUrl: "./qualification-model.component.html",
})
export class QualificationModelComponent {
  @Input() title: string;
  @Input() profileId: string;
  @Input() model: any;
  @Input() hasQualifications: boolean;
  @Input() profileData: StaffResponse;

  qualificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    public toastr: ToastrService
  ) {
    this.qualificationForm = this.fb.group({
      name: [""],
      staffId: [0, Validators.required],
      description: [""],
      qualificationDocuments: this.fb.array([]),
      qualificationExperiences: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    console.log(this.model);
    this.model.onShow.subscribe(() => {
      if (this.profileData) {
        this.updateForm(this.profileData);
      } else {
        this.addQualificationDocument(); // Add one document by default
        this.addQualificationExperience(); // Add one experience by default
      }
    });
  }

  updateForm(data: any): void {
    this.qualificationForm.patchValue({
      id: data.qualifications[0]?.id || 0,
      name: data.qualifications[0]?.name || "",
      staffId: data.qualifications[0]?.staffId || 0,
      description: data.qualifications[0]?.description || "",
    });

    data.qualifications[0]?.qualificationDocuments.forEach((document: any) => {
      this.addQualificationDocument(document);
    });

    data.qualifications[0]?.qualificationExperiences.forEach(
      (experience: any) => {
        this.addQualificationExperience(experience);
      }
    );
    console.log(data);
  }

  get qualificationDocuments(): FormArray {
    return this.qualificationForm.get("qualificationDocuments") as FormArray;
  }

  get qualificationExperiences(): FormArray {
    return this.qualificationForm.get("qualificationExperiences") as FormArray;
  }

  addQualificationDocument(document?: any): void {
    this.qualificationDocuments.push(
      this.fb.group({
        id: [document?.id || 0],
        name: [document?.name || "", Validators.required],
        documentPath: [document?.documentPath || ""],
        qualificationId: [document?.qualificationId || 0],
      })
    );
  }

  addQualificationExperience(experience?: any): void {
    this.qualificationExperiences.push(
      this.fb.group({
        id: [experience?.id || null],
        placeName: [experience?.placeName || "", Validators.required],
        startDate: [experience?.startDate || ""],
        endDate: [experience?.endDate || ""],
        isPresent: [experience?.isPresent || false],
        jobTitle: [experience?.jobTitle || ""],
        responsibility: [experience?.responsibility || ""],
        qualificationId: [experience?.qualificationId || 0],
        date: [
          [new Date(experience?.startDate), new Date(experience?.endDate)] ||
            [],
        ],
      })
    );
  }

  removeQualificationDocument(index: number): void {
    this.qualificationDocuments.removeAt(index);
  }

  removeQualificationExperience(index: number): void {
    this.qualificationExperiences.removeAt(index);
  }

  handleFileInput(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.qualificationDocuments
          .at(index)
          .patchValue({ documentPath: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  createQualificationHandler() {
    let payload: QualificationsPayload = this.qualificationForm.value;
    let newExperiences: QualificationExperience[] =
      payload.qualificationExperiences.map(
        (qualifiction: QualificationExperience) => ({
          placeName: qualifiction.placeName,
          startDate: qualifiction?.date[0] ? qualifiction?.date[0] : null,
          endDate: qualifiction?.date[1] ? qualifiction?.date[0] : null,
          isPresent: qualifiction.isPresent,
          jobTitle: qualifiction.jobTitle,
          responsibility: qualifiction.responsibility,
        })
      );

    payload.qualificationExperiences = newExperiences;
    payload.staffId = this.profileId;
    console.log(this.qualificationForm);
    if (this.qualificationForm.valid) {
      this.profileService.createQualification(payload).subscribe(
        (res) => {
          console.log(res);
          this.toastr.success(res.message, "Qualifications");
          this.model.hide();
        },
        (err) => {
          console.log(err);
          this.toastr.error(err.message, "Qualifications");
        }
      );
    }
  }

  updateQualificationHandler() {
    let payload: QualificationsPayloadPut = this.qualificationForm.value;
    let newExperiences: QualificationExperiencePut[] =
      payload.qualificationExperiences.map(
        (qualifiction: QualificationExperiencePut) => ({
          id: qualifiction.id,
          qualificationId: qualifiction.qualificationId,
          placeName: qualifiction.placeName,
          startDate: qualifiction?.date[0] ? qualifiction?.date[0] : null,
          endDate: qualifiction?.date[1] ? qualifiction?.date[0] : null,
          isPresent: qualifiction.isPresent,
          jobTitle: qualifiction.jobTitle,
          responsibility: qualifiction.responsibility,
        })
      );

    payload.qualificationExperiences = newExperiences;
    payload.staffId = +this.profileId;
    console.log(this.qualificationForm);
    if (this.qualificationForm.valid) {
      this.profileService.updateQualification(payload).subscribe(
        (res) => {
          console.log(res);
          this.toastr.success(res.message, "Qualifications");
          this.model.hide();
        },
        (err) => {
          console.log(err);
          this.toastr.error(err.message, "Qualifications");
        }
      );
    }
  }

  onSubmit(): void {
    this.hasQualifications
      ? this.updateQualificationHandler()
      : this.createQualificationHandler();
  }
}
