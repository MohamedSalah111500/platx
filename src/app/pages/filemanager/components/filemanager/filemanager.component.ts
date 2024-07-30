import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Student, Group } from "src/app/pages/groups/types";
import { FilemanagerService } from "../../services/filemanager.service";
import {
  CreateFileForm,
  CreateFilePayload,
  FileItem,
  GetAllFilesSizeResponse,
} from "../../types";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ATTACHMENT_NAMES, ATTACHMENTS_TYPES } from "src/app/utiltis/lookups";
import { convertObjectToArray, getIconClass } from "src/app/utiltis/functions";

@Component({
  selector: "app-filemanager",
  templateUrl: "./filemanager.component.html",
  styleUrls: ["./filemanager.component.scss"],
})
export class FilemanagerComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  // Table data
  total: Observable<number>;
  files: File[] = [];
  endItem: any;
  editMode: boolean = false;
  editItem!: Student;
  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: any;
  loading: boolean = false;
  list: FileItem[];
  filesSize: GetAllFilesSizeResponse;

  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;

  getIconClass = getIconClass;
  submitted = false;
  attachmentTypesList = convertObjectToArray(ATTACHMENT_NAMES);
  radialoptions!: any;
  dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    previewsContainer: false,
  };
  uploadedFiles: any[] = [];
  fileManagerForm: FormGroup<CreateFileForm> = new FormGroup<CreateFileForm>({
    name: new FormControl("", [Validators.required]),
    attachmentType: new FormControl(this.attachmentTypesList[0].value, [
      Validators.required,
    ]),
    path: new FormControl("", []),
    link: new FormControl("", []),
  });
  constructor(
    public store: Store,
    public toastr: ToastrService,
    private filemanagerService: FilemanagerService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Students", active: true },
    ];

    this.radialoptions = {
      series: [76],
      chart: {
        height: 150,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#556ee6"],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: "60%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "16px",
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      stroke: {
        dashArray: 3,
      },
      labels: ["Storage"],
    };

    this.getAllData(this.page, this.pageSize);
    this.getAllFilesSizeHandler();
  }

  changeFileType(event) {
    if (!event?.value) return;
    if (event.value == 5) {
      this.fileManagerForm.controls.link.setValidators([]);
      this.fileManagerForm.controls.path.clearValidators();

      this.fileManagerForm.controls.link.updateValueAndValidity();
      this.fileManagerForm.controls.path.updateValueAndValidity();
    } else {
      this.fileManagerForm.controls.path.setValidators([]);
      this.fileManagerForm.controls.link.clearValidators();

      this.fileManagerForm.controls.link.updateValueAndValidity();
      this.fileManagerForm.controls.path.updateValueAndValidity();
    }
  }

  onUploadSuccess(file: any) {
    setTimeout(() => {
      this.uploadedFiles.push(file);
      this.getBase64(file).then((data) => {
        this.fileManagerForm.controls.path.setValue(data);
      });
    }, 100);
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.filemanagerService.getAllFiles(pageNumber, pageSize).subscribe(
      (response) => {
        this.list = response.items;
        this.returnedArray = [...this.list];
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getAllFilesSizeHandler() {
    this.filemanagerService.getAllFilesSize().subscribe(
      (response) => (this.filesSize = response),
      (error) => {}
    );
  }

  // fiter job
  search() {
    if (this.term) {
      this.list = this.returnedArray.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.list = this.returnedArray;
    }
  }

  pageChanged(event: PageChangedEvent): void {
    this.getAllData(event.page, event.itemsPerPage);
    this.page = event.page;
  }

  openDeleteModel(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  confirmDelete(id: any) {
    this.filemanagerService.deleteFile(id).subscribe(() => {
      this.toastr.success("deleted successfully", "File");
      this.getAllData(this.page, this.pageSize);
    });
    this.removeItemModal?.hide();
  }

  edit(item: any) {
    this.editMode = true;
    this.submitted = false;
    this.editItem = item;
    this.fileManagerForm.patchValue(item);
    console.log(item)
    this.newContactModal?.show();
  }

  create(): void {
    this.submitted = true;
    console.log(this.fileManagerForm, "payload");
    if (this.fileManagerForm.valid) {
      const payload: CreateFilePayload = {
        name: this.fileManagerForm.value.name,
        attachementType: this.fileManagerForm.value.attachmentType,
        link: this.fileManagerForm.value.link,
        path: this.fileManagerForm.value.path,
      };

      console.log(payload, "payload");
      if (this.editMode) {
        // payload["id"] = this.fileManagerForm.value.id;
        // this.filemanagerService
        //   .updateStudent(this.editItem.id, payload)
        //   .subscribe((response) => {
        //     this.toastr.success("Student updated successfully", "Successfully");
        //     this.fileManagerForm.reset();
        //     this.newContactModal?.hide();
        //     this.getAllData(this.page, this.pageSize);
        //   });
      } else {
        this.filemanagerService.createFile(payload).subscribe((response) => {
          this.toastr.success("File created successfully", "Successfully");
          this.fileManagerForm.reset();
          this.newContactModal?.hide();
          this.getAllData(this.page, this.pageSize);
        });
      }
    }
  }
}
