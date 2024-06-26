import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import {
  adduserlist,
  deleteuserlist,
  fetchuserlistData,
  updateuserlist,
} from "src/app/store/UserList/userlist.action";
import { selectData } from "src/app/store/UserList/userlist-selector";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { Student } from "../types";
import { ManageService } from "../services/manageService.service";

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  // styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  contactsList: any;
  // Table data
  total: Observable<number>;
  contacts: any;
  files: File[] = [];
  endItem: any;

  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal", { static: false })
  removeItemModal?: ModalDirective;
  deleteId: any;
  returnedArray: any;

  // -------------------
  loading: boolean = false;
  list: Student[];

  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 8;
  studentForm: FormGroup<any>;
  submitted = false;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    public store: Store,
    private studentsService:ManageService
    ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Students", active: true },
    ];

    this.studentForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      dateOfBirth: ["", Validators.required],
      enrollment: ["", Validators.required],
      address: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      emergencyContact: ["", Validators.required],
      grades: ["", Validators.required],
      userId: [""],
      profileImage: [""],
    });
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
      this.studentForm.controls["profileImage"].setValue(this.imageURL);
    };
    reader.readAsDataURL(file);
  }


  // Save User
  saveUser() {
    if (this.studentForm.valid) {
      if (this.studentForm.get("id")?.value) {
        const updatedData = this.studentForm.value;
        this.store.dispatch(updateuserlist({ updatedData }));
      } else {
        this.studentForm.controls["id"].setValue(
          (this.contactsList.length + 1).toString()
        );
        const newData = this.studentForm.value;
        this.store.dispatch(adduserlist({ newData }));
      }
    }
    this.newContactModal?.hide();
    document.querySelectorAll("#member-img").forEach((element: any) => {
      element.src = "assets/images/users/user-dummy-img.jpg";
    });

    setTimeout(() => {
      this.studentForm.reset();
    }, 1000);
  }

  // fiter job
  searchJob() {
    if (this.term) {
      this.contactsList = this.returnedArray.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.contactsList = this.returnedArray;
    }
  }

  // Edit User
  editUser(id: any) {
    this.submitted = false;
    this.newContactModal?.show();
    var modelTitle = document.querySelector(".modal-title") as HTMLAreaElement;
    modelTitle.innerHTML = "Edit Profile";
    var updateBtn = document.getElementById(
      "addContact-btn"
    ) as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.studentForm.patchValue(this.contactsList[id]);
  }

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.contactsList = this.returnedArray.slice(startItem, this.endItem);
  }

  // Delete User
  removeUser(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  confirmDelete(id: any) {
    this.store.dispatch(deleteuserlist({ id: this.deleteId }));
    this.removeItemModal?.hide();
  }

  create() {
    this.submitted = true;
    if (this.studentForm.valid) {
      this.studentsService.createStudent(this.studentForm.value).subscribe(
        (response) => {
          console.log('Student created:', response);
        },
        (error) => {
          console.error('Error creating student:', error);
        }
      );
    }
  }
}
