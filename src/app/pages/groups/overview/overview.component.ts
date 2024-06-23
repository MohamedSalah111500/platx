import { Component, OnInit, ViewChild } from "@angular/core";

import { overviewBarChart } from "./data";

import { ChartType } from "./overview.model";
import { Observable, Subscription } from "rxjs";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import {
  adduserlist,
  deleteuserlist,
  fetchuserlistData,
  updateuserlist,
} from "src/app/store/UserList/userlist.action";
import { selectData } from "src/app/store/UserList/userlist-selector";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import {
  fetchchatMessageData,
  fetchchatdata,
} from "src/app/store/Chat/chat.action";
import { selectchatData } from "src/app/store/Chat/chat-selector";
import { GroupsService } from "../services/groupsService.service";
import { Student } from "../types";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})

/**
 * Overview component
 */
export class OverviewComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  loading: boolean = false;
  students!: Student[];
  groupId: string;

  overviewBarChart: ChartType;
  statData = [
    {
      icon: "bx bx-user",
      title: "Members",
      value: "26 ",
    },
    {
      icon: "bx bx-calendar",
      title: "Start",
      value: "08 Sept - 02H:35Min",
    },
    {
      icon: "bx bx-collection",
      title: "Group Status",
      value: "Active",
    },

    {
      icon: "bx bx-book",
      title: "Subject Progress",
      value: "68%",
    },
  ];
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
  // chat
  @ViewChild("scrollEle") scrollEle;
  @ViewChild("scrollRef") scrollRef;

  username = "Steven Franklin";
  chatData: any;
  chatMessagesData: any;
  formData: UntypedFormGroup;
  // Form submit
  chatSubmit: boolean;
  usermessage: string;
  emoji: any = "";

  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    public store: Store,
    private groupsService: GroupsService,
    private route: ActivatedRoute
  ) {
      this.groupId =this.route.snapshot.params['id'];
      // You can use the 'id' value as needed
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Groups" },
      { label: "Group No. X", active: true },
    ];
    this.overviewBarChart = overviewBarChart;

    setTimeout(() => {
      this.store.dispatch(fetchuserlistData());
      this.store.select(selectData).subscribe((data) => {
        this.contactsList = data;
        this.returnedArray = data;
        this.contactsList = this.returnedArray.slice(0, 10);
      });
      document.getElementById("elmLoader")?.classList.add("d-none");
    }, 1200);

    this.createContactForm = this.formBuilder.group({
      id: [""],
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      position: ["", [Validators.required]],
      tags: ["", [Validators.required]],
      profile: ["", [Validators.required]],
    });

    //chat
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "Chat", active: true },
    ];

    this.formData = this.formBuilder.group({
      message: ["", [Validators.required]],
    });

    /**
     * fetches data
     */
    this.store.dispatch(fetchchatdata());
    this.store.select(selectData).subscribe((data) => {
      this.chatData = data;
    });
    this.store.dispatch(fetchchatMessageData());
    this.store.select(selectchatData).subscribe((data) => {
      this.chatMessagesData = data;
    });

    this.getGroup(this.groupId);
    this.getGroupStudents(this.groupId, 1, 10);
  }

  getGroup(id: string) {
    this.loading = true;
    this.groupsService.getGroup(id).subscribe(
      (response) => {
        // this.student = response;
        console.log("Registration successful:", response);
        this.loading = false;
      },
      (error) => {
        let firstErrorMessage =
          error.error.errors[Object.keys(error.error.errors)[0]];
        // this.error = firstErrorMessage;
        this.loading = false;
      }
    );
  }

  getGroupStudents(id: string, pageNumber: number, pageSize: number) {
    this.loading = true;
    this.groupsService.getGroupStudents(id, pageNumber, pageSize).subscribe(
      (response) => {
        this.students = response.items;
        console.log("Registration successful:", response);
        this.loading = false;
      },
      (error) => {
        let firstErrorMessage =
          error.error.errors[Object.keys(error.error.errors)[0]];
        // this.error = firstErrorMessage;
        this.loading = false;
      }
    );
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
      this.createContactForm.controls["profile"].setValue(this.imageURL);
    };
    reader.readAsDataURL(file);
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
  editUser(id: any) {
    this.submitted = false;
    this.newContactModal?.show();
    var modelTitle = document.querySelector(".modal-title") as HTMLAreaElement;
    modelTitle.innerHTML = "Edit Profile";
    var updateBtn = document.getElementById(
      "addContact-btn"
    ) as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.createContactForm.patchValue(this.contactsList[id]);
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

  //chat

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }
  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }

  chatUsername(name) {
    this.username = name;
    this.usermessage = "Hello";
    this.chatMessagesData = [];
    const currentDate = new Date();

    this.chatMessagesData.push({
      name: this.username,
      message: this.usermessage,
      time: currentDate.getHours() + ":" + currentDate.getMinutes(),
    });
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get("message").value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: "right",
        name: "Mohamed Salah",
        message,
        time: currentDate.getHours() + ":" + currentDate.getMinutes(),
      });
      this.onListScroll();

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null,
      });
    }

    this.chatSubmit = true;
  }

  // Delete Message
  deleteMessage(event: any) {
    event.target.closest("li").remove();
  }

  // Copy Message
  copyMessage(event: any) {
    navigator.clipboard.writeText(
      event.target.closest("li").querySelector("p").innerHTML
    );
  }

  // Delete All Message
  deleteAllMessage(event: any) {
    var allMsgDelete: any = document
      .querySelector(".chat-conversation")
      ?.querySelectorAll("li");
    allMsgDelete.forEach((item: any) => {
      item.remove();
    });
  }

  // Emoji Picker
  showEmojiPicker = false;
  sets: any = [
    "native",
    "google",
    "twitter",
    "facebook",
    "emojione",
    "apple",
    "messenger",
  ];
  set: any = "twitter";
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const { emoji } = this;
    if (this.formData.get("message").value) {
      var text = `${emoji}${event.emoji.native}`;
    } else {
      text = event.emoji.native;
    }
    this.emoji = text;
    this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }

  onBlur() {}

  closeReplay() {
    document.querySelector(".replyCard")?.classList.remove("show");
  }

  // Contact Search
  ContactSearch() {
    var input: any,
      filter: any,
      ul: any,
      li: any,
      a: any | undefined,
      i: any,
      txtValue: any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".chat-list");
    ul.forEach((item: any) => {
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h5")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    });
  }

  ngOnDestroy() {

  }
}
