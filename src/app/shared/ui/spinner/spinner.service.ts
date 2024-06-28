// spinner.service.ts

import { Injectable, Signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private visibilitySubject = new BehaviorSubject<boolean>(false);
  visibility$ = this.visibilitySubject.asObservable();

  show() {
    console.log("show")
    this.visibilitySubject.next(true);
  }

  hide() {
    console.log("hide")

    this.visibilitySubject.next(false);
  }
}
