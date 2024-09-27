import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Student, Group } from "src/app/pages/groups/types";
import { FilemanagerService } from "../../services/filemanager.service";
import {
  CreateFileForm,
  FileItem,
  GetAllFilesSizeResponse,
  UpdateFilePayload,
} from "../../types";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ATTACHMENT_NAMES, ATTACHMENTS_TYPES } from "src/app/utiltis/lookups";
import {
  calculateTotalSizeInGB,
  convertDateToLocalDate,
  convertObjectToArray,
  copyToClipboard,
  downloadFileUseURL,
  formatStorageUsage,
  getIconClass,
} from "src/app/utiltis/functions";
import { FILE_MANAGER_URLS } from "src/app/utiltis/urls";

@Component({
  selector: "app-filemanager",
  templateUrl: "./filemanager.component.html",
  styleUrls: ["./filemanager.component.scss"],
})
export class FilemanagerComponent implements OnInit {
  convertDateToLocalDate = convertDateToLocalDate;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;

  // Table data
  total: Observable<number>;
  files: File[] = [];
  endItem: any;
  editMode: boolean = false;
  editItem!: Student;
  @ViewChild("newContactModal") newContactModal?: ModalDirective;
  @ViewChild("removeItemModal") removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: any;
  loading: boolean = false;
  list: FileItem[];
  filesSize: GetAllFilesSizeResponse;

  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;

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
    attachmentType: new FormControl("", [Validators.required]),
    fileContent: new FormControl(null, []),
    link: new FormControl("", []),
  });

  constructor(
    public store: Store,
    public toastr: ToastrService,
    private filemanagerService: FilemanagerService
  ) {}

  getIconClass = getIconClass;
  formatStorageUsage = formatStorageUsage;
  copyToClipboard = copyToClipboard;

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

  newContent(model: ModalDirective) {
    this.editMode = false;
    this.submitted = false;
    this.uploadedFiles = [];
    this.fileManagerForm.reset();
    model.show();
  }
  changeFileType(event) {
    if (!event?.value) return;
    if (event.value == 5) {
      this.fileManagerForm.controls.link.setValidators([]);
      this.fileManagerForm.controls.fileContent.clearValidators();

      this.fileManagerForm.controls.link.updateValueAndValidity();
      this.fileManagerForm.controls.fileContent.updateValueAndValidity();
    } else {
      this.fileManagerForm.controls.fileContent.setValidators([]);
      this.fileManagerForm.controls.link.clearValidators();

      this.fileManagerForm.controls.link.updateValueAndValidity();
      this.fileManagerForm.controls.fileContent.updateValueAndValidity();
    }
  }

  onUploadSuccess(file: any) {
    setTimeout(() => {
      this.uploadedFiles.push(file);
      this.fileManagerForm.controls.fileContent.setValue(file);
    }, 100);
  }

  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  getAllData(pageNumber: number, pageSize: number, search: string = "") {
    this.loading = true;
    this.filemanagerService.getAllFiles(pageNumber, pageSize, search).subscribe(
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
      (response) => {
        this.filesSize = response;
        this.filesSize.usedSizeGB = calculateTotalSizeInGB(response);
        this.radialoptions.series = [
          formatStorageUsage(
            this.filesSize.usedSizeGB,
            10
          ).usedPercentage.toFixed(2),
        ];
      },
      () => {}
    );
  }

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

  copyURLToClipboard(text: string): void {
    this.copyToClipboard(text)
      .then(() => this.toastr.success("Text copied to clipboard", "Copied"))
      .catch((err) =>
        this.toastr.error("Could not copy text: " + err, "Copied")
      );
  }

  openDeleteModel(item: any) {
    this.deleteId = item.id;
    this.removeItemModal?.show();
  }

  confirmDelete() {
    this.filemanagerService.deleteFile(this.deleteId).subscribe(() => {
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
    this.fileManagerForm.controls.attachmentType.setValue(item.attachementType);
    this.fileManagerForm.updateValueAndValidity();
    this.newContactModal?.show();
  }

  download(item: FileItem) {
    downloadFileUseURL(FILE_MANAGER_URLS.GET_DOWNLOAD_FILE(item.id));
  }

  create(): void {
    this.submitted = true;
    if (this.fileManagerForm.valid) {
      if (this.editMode) {
        let payload: UpdateFilePayload = {
          id: this.editItem.id,
          name: this.fileManagerForm.value.name,
          link: this.fileManagerForm.value.link,
        };

        this.filemanagerService.updateStudent(payload).subscribe((res) => {
          this.toastr.success("File updated successfully", "Successfully");
          this.fileManagerForm.reset();
          this.newContactModal?.hide();
          this.getAllData(this.page, this.pageSize);
        });
      } else {
        let fdPayload = new FormData();
        fdPayload.append("name", this.fileManagerForm.value.name);
        fdPayload.append(
          "attachementType",
          this.fileManagerForm.value.attachmentType
        );
        fdPayload.append("link", this.fileManagerForm.value.link);
        fdPayload.append("fileContent", this.fileManagerForm.value.fileContent);

        this.filemanagerService.createFile(fdPayload).subscribe((res) => {
          this.toastr.success("File created successfully", "Successfully");
          this.fileManagerForm.reset();
          this.newContactModal?.hide();
          this.getAllData(this.page, this.pageSize);
          this.getAllFilesSizeHandler();
        });
      }
    }
  }
}
