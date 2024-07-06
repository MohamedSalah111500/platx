import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { QualificationExperience, QualificationsPayload } from "../../types";
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


  qualificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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
    this.addQualificationDocument(); // Add one document by default
    this.addQualificationExperience(); // Add one experience by default
  }

  get qualificationDocuments(): FormArray {
    return this.qualificationForm.get("qualificationDocuments") as FormArray;
  }

  get qualificationExperiences(): FormArray {
    return this.qualificationForm.get("qualificationExperiences") as FormArray;
  }

  addQualificationDocument(): void {
    this.qualificationDocuments.push(
      this.fb.group({
        name: ["", Validators.required],
        documentPath: [""],
      })
    );
  }

  removeQualificationDocument(index: number): void {
    this.qualificationDocuments.removeAt(index);
  }

  addQualificationExperience(): void {
    this.qualificationExperiences.push(
      this.fb.group({
        placeName: ["", Validators.required],
        startDate: [""],
        endDate: [""],
        date: [""],
        isPresent: [false],
        jobTitle: [""],
        responsibility: [""],
      })
    );
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

  onSubmit(): void {
    let payload: QualificationsPayload = this.qualificationForm.value;
    let newExperiences: QualificationExperience[] =
      payload.qualificationExperiences.map(
        (qualifiction: QualificationExperience) => ({
          placeName: qualifiction.placeName,
          startDate: qualifiction?.date[0]? qualifiction?.date[0]:null,
          endDate: qualifiction?.date[1]? qualifiction?.date[0]:null,
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
          this.model.hide()
        },
        (err) => {
          console.log(err);
          this.toastr.error(err.message, "Qualifications");

        }
      );
    }
  }
}
