import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DndDropEvent } from "ngx-drag-drop";
import { CdkDragDrop, transferArrayItem,moveItemInArray } from "@angular/cdk/drag-drop";

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
import { Store } from "@ngrx/store";
import { ExamService } from "../../services/exam.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "new-exam",
  templateUrl: "new-exam.component.html",
  styleUrls: ["new-exam.component.scss"],
})
export class NewExamComponent implements OnInit {
  // // bread crumb items
  breadCrumbItems: Array<{}>;
  public Editor = ClassicEditor;

  taskForm!: UntypedFormGroup;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public store: Store,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Tasks" },
      { label: "Kanban Board", active: true },
    ];
  }

  availableFields = [
    { type: "single", label: "Single Choice", answers: [] },
    { type: "multiple", label: "Multiple Choice", answers: [] },
  ];

  formFields = [];

  addField(field) {
    this.formFields.push({
      ...field,
      id: Date.now(),
      label: field.label,
      answers: field.answers || [],
      newOption: "",
      editMode: false,
      required: false,
      labelType: "text", // Can be 'text' or 'text-image'
      labelText: "",
      labelImage: null,
      correctAnswers: [], // Array to store correct answers
    });
  }

  toggleEditMode(field) {
    field.editMode = !field.editMode;
    console.log(field)
  }

  editLabelText(field, event) {
    field.labelText = event.target.value;
  }

  onImageUpload(field, event) {
    const reader = new FileReader();
    reader.onload = () => {
      field.labelImage = reader.result as string;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  addOption(field) {
    if (!field.newOption || field.newOption.trim() === "") return;
    field.answers.push(field.newOption);
    field.newOption = "";
  }

  toggleCorrectAnswer(field, option) {
    const index = field.correctAnswers.indexOf(option);
    if (index > -1) {
      field.correctAnswers.splice(index, 1);
    } else {
      field.correctAnswers.push(option);
    }
  }

  removeField(index) {
    this.formFields.splice(index, 1);
  }

  removeOption(field, index) {
    field.answers.splice(index, 1);
  }

  onDrop(event: DndDropEvent) {
    if (event.index !== undefined && event.index !== null) {
      moveItemInArray(this.formFields, event.index, event["dropIndex"]);
    }
  }

  submitForm() {
    const formData = this.formFields.map((field) => ({
      type: field.type,
      labelText: field.labelText,
      labelImage: field.labelImage,
      answers: field.answers,
      correctAnswers: field.correctAnswers,
      required: field.required,
    }));

    console.log("Form Data:", formData);
    alert(JSON.stringify(formData, null, 2));
  }
}

// function moveItemInArray(array: any[], fromIndex: number, toIndex: number) {
//   const [movedItem] = array.splice(fromIndex, 1);
//   array.splice(toIndex, 0, movedItem);
// }
