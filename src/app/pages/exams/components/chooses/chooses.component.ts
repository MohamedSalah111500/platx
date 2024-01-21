import {Component,EventEmitter,Input,OnInit,Output} from '@angular/core';
import { IQuestion, QuestionName, QuestionType, Questions } from '../../types';

@Component({
  selector: 'app-chooses-control',
  templateUrl: './chooses.component.html',
  styleUrl: './chooses.component.scss'
})
export class ChoosesComponent implements OnInit{
  @Input() control: Questions;
  @Output() openQuestionModalEmitter = new EventEmitter<{type: QuestionType,name: QuestionName}>();

  constructor(){
    }
  ngOnInit(): void {
    console.log(this.control.type)
  }
  emmitOpen (type: QuestionType,name: QuestionName) {
    this.openQuestionModalEmitter.next({type,name})
  }

}
