import { FormArray, FormControl } from "@angular/forms";

export interface IQuestion {
  type: QuestionType;
  icon: string;
  name: QuestionName
}
export type QuestionType = 'textarea' | 'text' | 'radio' | 'checkbox'
export type QuestionName = 'Text Area' | 'Text Input' | 'Radio Button' | 'Check Box'

export interface IReadyQuestion {
  name:QuestionName
  type:QuestionType
  label:string
  value?:string
  isRequired:boolean
  choices?:IQuestionChoice[]
}
export interface IQuestionChoice {
  choiceText: string;
  isCorrect: boolean
}

export interface Questions {
  id: string;
  title: string;
  date: string;
  status: string;
  type:string
}

export interface ChoosesFormGroup {
  title: FormControl;
  options:FormArray;
}
