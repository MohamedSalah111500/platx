import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { CHAT_URLS } from "src/app/utiltis/urls";
import { ToastrService } from "ngx-toastr";
import {
  IGeneralErrorMessageResponse,
  IGeneralSuccessMessageResponse,
} from "src/app/shared/general-types";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getMessagesWithStudent(studentId: number, groupId: number): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http
        .get(CHAT_URLS.GET_MESSAGE_WITH_STUDENT(studentId, groupId))
        .subscribe(
          (responseData: any) => {
            responseData = responseData.map((message) => ({
              ...message,
              align: message.senderStaffId ? "right" : "left",
            }));
            observer.next(responseData);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }
}
