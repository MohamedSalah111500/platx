import {Component,EventEmitter,Input,Output} from '@angular/core';
import { IQuestion, QuestionName, QuestionType } from '../../types';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [],
  templateUrl: './fields.component.html',
  styleUrl: './fields.component.scss'
})
export class FieldsComponent {
  @Input({required: true}) formElements: IQuestion[] = []
  @Output() openQuestionModalEmitter = new EventEmitter<{type: QuestionType,name: QuestionName}>();

  emmitOpen (type: QuestionType,name: QuestionName) {
    this.openQuestionModalEmitter.next({type,name})
  }

}
