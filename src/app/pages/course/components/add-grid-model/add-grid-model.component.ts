import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CreateGridForm } from "../../types";

@Component({
  selector: "platx-add-grid-model",
  templateUrl: "./add-grid-model.component.html",
})
export class AddGridModelComponent {
  @Input() title: string;
  @Input() gridId: string;
  @Input() model: any;
  @Output() eventAction = new EventEmitter<{}>();

  gridForm: FormGroup<CreateGridForm> = new FormGroup<CreateGridForm>({
    name: new FormControl("", [Validators.required]),
  });

  constructor(private fb: FormBuilder, public toastr: ToastrService) {
    this.gridForm = this.fb.group({
      name: [""],
    });
  }

  ngOnInit(): void {
    this.model.onShow.subscribe(() => {
      if (this.gridId) {
        this.updateForm(this.gridId);
      }
    });
  }

  updateForm(data: any): void {
    // this.gridForm.patchValue({
    //   id: data.qualification?.id || 0,
    //   name: data.qualification?.name || "",
    // });
  }

  createGridHandler() {
    let payload: any = this.gridForm.value;
    payload.id = this.gridId;
    this.eventAction.emit(payload);
    this.model.hide();
    // if (this.gridForm.valid) {
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

  updateGridHandler() {
    let payload: any = this.gridForm.value;
    payload.id = this.gridId;
    this.eventAction.emit(payload);

    this.model.hide();
    // if (this.gridForm.valid) {
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
    this.gridId ? this.updateGridHandler() : this.createGridHandler();
  }
}
