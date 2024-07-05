import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "platx-qualification-model",
  templateUrl: "./qualification-model.component.html",
})
export class QualificationModelComponent {
  @Input() title: string;
  qualificationForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.qualificationForm = this.fb.group({
      id: [0, Validators.required],
      name: ["", Validators.required],
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
        id: [0, Validators.required],
        name: ["", Validators.required],
        documentPath: [""],
        qualificationId: [0, Validators.required],
      })
    );
  }

  removeQualificationDocument(index: number): void {
    this.qualificationDocuments.removeAt(index);
  }

  addQualificationExperience(): void {
    this.qualificationExperiences.push(
      this.fb.group({
        id: [0, Validators.required],
        placeName: ["", Validators.required],
        startDate: [""],
        endDate: [""],
        date: [""],
        isPresent: [false],
        jobTitle: [""],
        responsibility: [""],
        qualificationId: [0, Validators.required],
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
    console.log(this.qualificationForm.value)
    if (this.qualificationForm.valid) {
      this.http
        .put("api/your-endpoint", this.qualificationForm.value)
        .subscribe(
          (response) => {
            console.log("Qualification updated successfully", response);
          },
          (error) => {
            console.error("Error updating qualification", error);
          }
        );
    }
  }
}
