import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  ViewChild,
  Output,
} from "@angular/core";
import { member } from "./data";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { GroupsService } from "../services/groupsService.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CreateGroupAPIPayload, CreateGroupForm } from "../types";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})

/**
 * Projects-create component
 */
export class CreateComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  selected: any;
  hidden: boolean;
  files: File[] = [];
  assignMember: any;
  submitted: boolean = false;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild("dp", { static: true }) datePicker: any;

  createGroupForm: FormGroup<CreateGroupForm> = new FormGroup<CreateGroupForm>({
    description: new FormControl("", [Validators.required]),
    cron: new FormControl("0 7 * * 1-6", [Validators.required]),
    icon: new FormControl("", [Validators.required]),
    isActive: new FormControl(false, [Validators.required]),
    status: new FormControl(0, [Validators.required]),
  });

  constructor(
    private groupsService: GroupsService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Projects" },
      { label: "Create New", active: true },
    ];

    this.selected = "";
    this.hidden = true;
    this.assignMember = member;
  }

  // File Upload
  imageURL: any;
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    let file: File = event.addedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      setTimeout(() => {
        // this.profile.push(this.imageURL)
      }, 100);
    };
    reader.readAsDataURL(file);
  }

  assignList: any = [];
  slectMember(id: any) {
    if (this.assignMember[id].checked == "0") {
      this.assignMember[id].checked = "1";
      this.assignList.push(this.assignMember[id]);
    } else {
      this.assignMember[id].checked = "0";
      this.assignList.pop(this.assignMember[id]);
    }
  }

  // filechange
  imageURLs: any;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageURLs = reader.result as string;

      document.querySelectorAll("#projectlogo-img").forEach((element: any) => {
        element.src = this.imageURLs;
      });
    };
  }
  // file upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
    }, 100);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.createGroupForm);
    if (this.createGroupForm.invalid) return;
    // stop here if form is invalid
    let payload: CreateGroupAPIPayload = {
      description: this.createGroupForm.controls.description.value,
      cron: this.createGroupForm.controls.cron.value,
      isActive: this.createGroupForm.controls.isActive.value,
      status: this.createGroupForm.controls.status.value,
      icon: this.createGroupForm.controls.icon.value,
    };

    //Dispatch Action
    this.groupsService.createGroup(payload).subscribe(
      (response) => {
        console.log("Registration successful:", response);
        this.toastr.success("Registration successful", "Bootstrap");
      },
      (error) => {
        let firstErrorMessage =
          error.error.errors[Object.keys(error.error.errors)[0]];
        // this.error = firstErrorMessage;
      }
    );
  }
}
