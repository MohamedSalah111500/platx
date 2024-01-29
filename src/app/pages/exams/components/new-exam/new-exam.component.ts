import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DndDropEvent } from "ngx-drag-drop";

import { DatePipe } from "@angular/common";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";
import { selectData } from "src/app/store/Tasks/tasks-selector";
import {
  addtasklist,
  fetchtasklistData,
  updatetasklist,
} from "src/app/store/Tasks/tasks.action";
import { Task } from "src/app/store/Tasks/tasks.model";
import { memberList } from "src/app/core/data";
import { tasks } from "../list/data";
import { IQuestion, QuestionName, QuestionType, Questions } from "../../types";
import { QuestionService } from "../../services/question.service";
import { randId } from "src/app/utiltis/functions";

@Component({
  selector: "new-exam",
  templateUrl: "new-exam.component.html",
  styleUrls: ["new-exam.component.scss"],
})
export class NewExamComponent implements OnInit {
  @Input({ required: true }) name!: QuestionName;
  @Input({ required: true }) type!: QuestionType;
  singleInputStructureForm!: FormGroup;
  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;

  formTypes: IQuestion[] = [
    { type: "textarea", icon: "fa-regular fa-file-lines", name: "Text Area" },
    { type: "text", icon: "fa-solid fa-paragraph", name: "Text Input" },
    { type: "checkbox", icon: "fa-solid fa-square-check", name: "Check Box" },
    { type: "radio", icon: "fa-regular fa-circle-dot", name: "Radio Button" },
  ];

  questions: Questions[] = [

  ];

  inprogressTasks: Task[];
  completedTasks: Task[];
  memberLists: any;
  status: any;
  assigneeMember: any = [];

  // bread crumb items
  breadCrumbItems: Array<{}>;
  taskForm!: UntypedFormGroup;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public store: Store,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private questionService: QuestionService
  ) {

  }

  ngOnInit() {

    this.breadCrumbItems = [
      { label: "Tasks" },
      { label: "Kanban Board", active: true },
    ];

    /**
     * fetches data
     */
    this.store.dispatch(fetchtasklistData());
    this.store.select(selectData).subscribe((data) => {
      this.memberLists = memberList;
    });

    this.addField('text')
  }

  addField(type: string): void {
    // const updatedData = this.taskForm.value;
    this.questions.push({
      id: randId(),
      title: type,
      date: "14 Oct, 2019",
      status: "upcoming",
      type:type
    });
  }

  /**
   * on dragging task
   * @param item item dragged
   * @param list list from item dragged
   */
  onDragged(item: any, list: any[]) {
    const index = list.indexOf(item);
    list.splice(index, 1);
  }

  /**
   * On task drop event
   */
  onDrop(event: DndDropEvent, filteredList?: any[], targetStatus?: string) {
    if (filteredList && event.dropEffect === "move") {
      let index = event.index;

      if (typeof index === "undefined") {
        index = filteredList.length;
      }

      filteredList.splice(index, 0, event.data);
    }
  }

  // Delete Data
  delete(event: any) {
    event.target.closest(".card .task-box")?.remove();
  }

  // Select Member
  selectMember(id: any) {
    if (this.memberLists[id].checked == true) {
      this.memberLists[id].checked = false;
      this.assigneeMember = this.assigneeMember.filter(
        (item) => item !== this.memberLists[id].profile
      );
    } else {
      this.memberLists[id].checked = true;
      this.assigneeMember.push(this.memberLists[id].profile);
    }
  }

}
