import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import {
  adduserlist,
  updateuserlist,
} from "src/app/store/UserList/userlist.action";
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
  list: Role[];

  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 8;
  roleForm: FormGroup<RoleForm>;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    public store: Store,
    private manageService: ManageService
  ) {
    this.roleForm = this.fb.group<RoleForm>({
      id: new FormControl(null),
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Roles", active: true },
    ];
    this.getAllData(this.page, this.pageSize);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.manageService.getAllRoles(pageNumber, pageSize).subscribe(
      (response) => {
        this.list = response.items;
        this.returnedArray = response.items;
        this.totalCount = response.totalCount;

        console.log(response.items);
      },
      (error) => {}
    );
  }

  create(): void {
    this.submitted = true;
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
  save() {
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

  search() {
    if (this.term) {
      this.list = this.returnedArray.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.list = this.returnedArray;
    }
  }

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
    this.getAllData(event.page, event.itemsPerPage);
    this.page = event.page;
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
