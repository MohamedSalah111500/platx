import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { GroupsService } from "../../groups/services/groupsService.service";
import { Group, Student } from "../../groups/types";
import { ChatService } from "../services/chat.service";
import {
  GetMessagesForTeacherInGroup,
  GetStudentsHaveMessagesResponse,
  SenderStudent,
  SendMessageToGroupPayload,
  SendMessageToStudentPayload,
} from "../types";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild("scrollEle") scrollEle;
  @ViewChild("scrollRef") scrollRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  chatData: any;
  chatMessagesData: any;
  formData: UntypedFormGroup;
  // Form submit
  chatSubmit: boolean;
  usermessage: string;
  emoji: any = "";

  chatName: string = "Start new Chat";
  groups!: Group[];
  selectedGroup!: Group;
  selectedStudent: SenderStudent = {};
  chatActiveType: string = "student";

  chatMessages!: GetMessagesForTeacherInGroup[];
  studentsChats!: GetStudentsHaveMessagesResponse[];

  constructor(
    public formBuilder: UntypedFormBuilder,
    public store: Store,
    private groupsService: GroupsService,
    private chatService: ChatService,
    private location: Location,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "platx" },
      { label: "Chat", active: true },
    ];

    this.formData = this.formBuilder.group({
      message: ["", [Validators.required]],
    });

    this.getAllGroups(1, 100);
    this.getStudentsHaveMessages();

    if (history.state.groupId) {
      this.startNewChatWithStudent(
        history.state.groupId,
        history.state.studentData
      );
      this.location.replaceState(this.location.path(), "", {});
    }
  }

  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 200;
  }
  // my code start here ------------------------

  getAllGroups(pageNumber: number, pageSize: number) {
    this.groupsService
      .getAllGroups(pageNumber, pageSize)
      .subscribe((response) => {
        this.groups = response.items;
      });
  }

  getMessagesForTeacherInGroup(groupId: number) {
    this.chatService
      .getMessagesForTeacherInGroup(groupId)
      .subscribe((response) => {
        this.chatMessages = response;
        this.onListScroll();
      });
  }

  getMessagesWithStudent(studentId: number, groupId: number) {
    this.chatService
      .getMessagesWithStudent(studentId, groupId)
      .subscribe((response) => {
        this.chatMessages = response;
        this.onListScroll();
      });
  }

  getStudentsHaveMessages() {
    //@TODO Replace static id
    let teacherId = 10;
    return this.chatService.getStudentsHaveMessages(teacherId).subscribe(
      (res) => {
        this.studentsChats = res;
      },
      (err) => console.log(err)
    );
  }

  sendMessagesForTeacherToGroup(content: string) {
    if (!this.selectedGroup) return;
    let payload: SendMessageToGroupPayload = {
      content: content,
      groupId: this.selectedGroup?.id,
      //@TODO Replace static id
      teacherId: 10,
    };
    return this.chatService.postMessagesForTeacherToGroup(payload);
  }

  startNewChatWithStudent(groupId: number, chatOwner: Student) {
    this.chatActiveType = "student";
    this.selectedStudent.id = chatOwner.id;
    this.selectedStudent.firstName = chatOwner.firstName;
    this.selectedStudent.lastName = chatOwner.lastName;
    this.chatName = chatOwner.firstName + " " + chatOwner.lastName;
    this.getMessagesWithStudent(this.selectedStudent.id, groupId);
  }

  sendMessagesToStudent(content: string) {
    if (!this.selectedStudent) return;
    //@TODO return group id with student
    let payload: SendMessageToStudentPayload = {
      content: content,
      studentId: this.selectedStudent.id,
      //@TODO Replace static id
      groupId: 1,
      teacherId: 10,
    };
    return this.chatService.postMessagesToStudent(payload);
  }

  chatClicked(chatOwner: Group | SenderStudent, type: string) {
    if (!chatOwner) return;
    if (type == "group") {
      this.chatActiveType = "group";
      this.selectedGroup = chatOwner as Group;
      this.chatName = this.selectedGroup.description;
      this.getMessagesForTeacherInGroup(this.selectedGroup.id);
    }

    if (type == "student") {
      this.chatActiveType = "student";
      this.selectedStudent = chatOwner as SenderStudent;
      this.chatName =
        this.selectedStudent.firstName + " " + this.selectedStudent.lastName;
      //@TODO
      this.getMessagesWithStudent(this.selectedStudent.id, 1);
    }
  }

  get form() {
    return this.formData.controls;
  }
  get now() {
    return new Date();
  }
  onListScroll() {
    if (
      this.scrollRef !== undefined &&
      this.scrollRef.SimpleBar !== undefined
    ) {
      setTimeout(() => {
        if (!this.scrollRef.SimpleBar?.getScrollElement()) return;
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get("message").value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      let functionCall;
      this.chatActiveType == "group"
        ? (functionCall = this.sendMessagesForTeacherToGroup.bind(this))
        : (functionCall = this.sendMessagesToStudent.bind(this));

      functionCall(message).subscribe((response) => {
        this.chatMessages.push({
          align: "right",
          senderStaff: {
            firstName: "Mohamed",
            lastName: "Ibrahem",
            id: 10,
          },
          content: message,
          sentAt: new Date(),
        });
        this.onListScroll();
      });
      this.formData = this.formBuilder.group({
        message: null,
      });
    }

    this.chatSubmit = true;
  }

  copyMessage(event: any) {
    navigator.clipboard
      .writeText(event.target.closest("li").querySelector("p").innerHTML)
      .then(() => this.toastr.success("copied to clipboard", "Copied"));
  }

  deleteMessage(messageId: string) {
    this.chatService.deleteSingleMessages(+messageId).subscribe(() => {
      this.chatMessages = this.chatMessages.filter(
        (mes) => mes.id != +messageId
      );
    });
  }

  deleteGroupMessages(groupId: number) {
    this.chatService.deleteGroupMessages(+groupId).subscribe(() => {
      this.chatMessages = [];
    });
  }

  deleteStudentMessages(studentId: number) {
    this.chatService.deleteGroupMessages(+studentId).subscribe(() => {
      this.chatMessages = [];
    });
  }

  deleteAllMessage() {
    if (!this.chatActiveType) return;
    if (this.chatActiveType == "student") {
      this.deleteStudentMessages(+this.selectedGroup.id);
    }
    if (this.chatActiveType == "group") {
      this.deleteGroupMessages(+this.selectedGroup.id);
    }
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
}
