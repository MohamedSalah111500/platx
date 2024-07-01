import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Store } from "@ngrx/store";
import {
  adduserlist,
  deleteuserlist,
  updateuserlist,
} from "src/app/store/UserList/userlist.action";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { GetAllStaffsResponse, Staff } from "../types";
import { ManageService } from "../services/manageService.service";
import { Group } from "../../groups/types";
import { ToastrService } from "ngx-toastr";
import { GroupsService } from "../../groups/services/groupsService.service";

@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  // styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  // Table data
  total: Observable<number>;
  files: File[] = [];
  endItem: any;
  editMode: boolean = false;
  editItem!: Staff;
  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: any;

  // -------------------
  loading: boolean = false;
  list: Staff[];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 8;
  stafftForm: FormGroup<any>;
  submitted = false;
  // lookups
  groups: Group[];

  constructor(
    private fb: FormBuilder,
    public store: Store,
    public toastr: ToastrService,
    private manageService: ManageService,
    private groupsService: GroupsService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Staff", active: true },
    ];

    this.stafftForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      dateOfBirth: ["", Validators.required],
      address: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      emergencyContact: ["", Validators.required],
      groups: [""],
      subjectsTaught: [null],
      userId: [""],
      profileImage: [""],
      id: [null],
    });

    this.getAllData(this.page, this.pageSize);
    this.getAllGroups();
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll("#member-img").forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.stafftForm.controls.profileImage.setValue(this.imageURL);
    };
    reader.readAsDataURL(file);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.manageService.getAllStaff(pageNumber, pageSize).subscribe(
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

  getAllGroups() {
    this.groupsService
      .getAllGroups(1, 100000)
      .subscribe((response) => (this.groups = response.items));
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
    this.manageService.deleteStaff(id).subscribe(() => {
      this.toastr.success("deleted successfully", "Staff");
      this.getAllData(this.page, this.pageSize);
    });
    this.removeItemModal?.hide();
  }

  edit(item: Staff) {
    this.editMode = true;
    this.submitted = false;
    this.editItem = item;
    this.stafftForm.patchValue(item);
    this.newContactModal?.show();
  }

  create(): void {
    this.submitted = true;
    if (this.stafftForm.valid) {
      const payload = {
        firstName: this.stafftForm.value.firstName,
        lastName: this.stafftForm.value.lastName,
        email: this.stafftForm.value.email,
        dateOfBirth: this.stafftForm.value.dateOfBirth,
        address: this.stafftForm.value.address,
        phoneNumber: this.stafftForm.value.phoneNumber,
        emergencyContact: this.stafftForm.value.emergencyContact,
        // subjectsTaught: this.stafftForm.value.subjectsTaught,
        groups: this.stafftForm.value.groups,
        userId: null,
        profileImage: this.stafftForm.controls.profileImage.value,
      };

      if (this.editMode) {
        payload["id"] = this.stafftForm.value.id;
        this.manageService.updateStaff(payload).subscribe((response) => {
          this.toastr.success("Staff updated successfully", "Successfully");
          this.stafftForm.reset();
          this.newContactModal?.hide();
          this.getAllData(this.page, this.pageSize);
        });
      } else {
        this.manageService.createStaff(payload).subscribe((response) => {
          this.toastr.success("Staff created successfully", "Successfully");
          this.stafftForm.reset();
          this.newContactModal?.hide();
          this.getAllData(this.page, this.pageSize);
        });
      }
      this.submitted = false;
    }
  }
}
