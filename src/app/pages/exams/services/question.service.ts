import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { IReadyQuestion } from '../types';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionModal$ = new Subject<IReadyQuestion | null>();
  question = this.questionModal$.asObservable()

  constructor () {
  }
  createQuestion (question: IReadyQuestion | null) {
    this.questionModal$.next(question)
  }
}
