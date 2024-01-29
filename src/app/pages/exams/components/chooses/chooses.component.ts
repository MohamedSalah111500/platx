import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  ChoosesFormGroup,
  IQuestion,
  QuestionName,
  QuestionType,
  Questions,
} from "../../types";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-chooses-control",
  templateUrl: "./chooses.component.html",
  styleUrl: "./chooses.component.scss",
})
export class ChoosesComponent implements OnInit {
  @Input() control: Questions;
  @Output() openQuestionModalEmitter = new EventEmitter<{
    type: QuestionType;
    name: QuestionName;
  }>();
  edit: boolean = false;
  dynamicForm: FormGroup<ChoosesFormGroup>;
  public Editor = ClassicEditor;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      title: [""], // Title input
      options: this.fb.array([]), // FormArray for options
    });
  }
  emmitOpen(type: QuestionType, name: QuestionName) {
    this.openQuestionModalEmitter.next({ type, name });
  }
  editControl(): void {
    this.edit = !this.edit;
    console.log(this.dynamicForm.value);
  }

  get options() {
    return this.dynamicForm.get("options") as FormArray;
  }

  addOption() {
    this.options.push(this.fb.group({
      label: [''],
      value: [false]
    }));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  onSubmit() {
    // Handle form submission logic here
    console.log(this.dynamicForm.value);
  }
}
