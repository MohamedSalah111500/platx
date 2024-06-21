import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import {
  FormControl,
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
import { ManageService } from "../services/manageService.service";
import { Role, RoleForm } from "../types";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  // styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  contactsList: any;
  // Table data
  total: Observable<number>;
  createContactForm!: UntypedFormGroup;
  submitted = false;
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
  totalCount: number = 0;
  list: Role[];

  page: number = 1;
  pageSize: number = 8;

  roleForm: FormGroup<RoleForm> = new FormGroup<RoleForm>({
    id: new FormControl<number>(0, []),
    name: new FormControl<string>("", [Validators.required]),
  });

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    public store: Store,
    private manageService: ManageService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Roles", active: true },
    ];

    this.getAllData(this.page, this.pageSize);

  }

  getAllData(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.manageService.getAllRoles(pageNumber, pageSize).subscribe(
      (response) => {
        this.list = response.items;
        this.returnedArray = response.items;
        this.totalCount = response.totalCount;

        console.log(response.items);
        this.loading = false;
        document.getElementById("elmLoader")?.classList.add("d-none");
      },
      (error) => {
        let firstErrorMessage =
          error.error.errors[Object.keys(error.error.errors)[0]];
        // this.error = firstErrorMessage;
        this.loading = false;
      }
    );
  }

  create(): void {
    if (this.roleForm.valid) {
      const payload = { name: this.roleForm.controls.name.value };
      this.manageService.createRole(payload).subscribe(
        (response) => {
          console.log("Role created:", response);
          // Handle success response
        },
        (error) => {
          console.error("Error creating role:", error);
          // Handle error response
        }
      );
    }
  }
  // Save User
  saveUser() {
    if (this.createContactForm.valid) {
      if (this.createContactForm.get("id")?.value) {
        const updatedData = this.createContactForm.value;
        this.store.dispatch(updateuserlist({ updatedData }));
      } else {
        this.createContactForm.controls["id"].setValue(
          (this.contactsList.length + 1).toString()
        );
        const newData = this.createContactForm.value;
        this.store.dispatch(adduserlist({ newData }));
      }
    }
    this.newContactModal?.hide();
    document.querySelectorAll("#member-img").forEach((element: any) => {
      element.src = "assets/images/users/user-dummy-img.jpg";
    });

    setTimeout(() => {
      this.createContactForm.reset();
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
  edit(item: any) {
    this.submitted = false;
    this.newContactModal?.show();
    var modelTitle = document.querySelector(".modal-title") as HTMLAreaElement;
    modelTitle.innerHTML = "Edit Profile";
    var updateBtn = document.getElementById(
      "addContact-btn"
    ) as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.roleForm.patchValue(item);
  }

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.contactsList = this.returnedArray.slice(startItem, this.endItem);
  }

  // Delete User
  deleteData(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  confirmDelete(id: any) {
    this.manageService.deleteRole(id).subscribe(
      (response) => {
        console.log("Role delete:", response);
        // Handle success response
      },
      (error) => {
        console.error("Error creating role:", error);
        // Handle error response
      }
    );
    this.removeItemModal?.hide();
  }
}
