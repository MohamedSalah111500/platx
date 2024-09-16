import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { CHAT_URLS } from "src/app/utiltis/urls";
import {
  GetMessagesForTeacherOrStudentInGroupResponse,
  SendMessageToGroupPayload,
  StudentSendMessageToGroupPayload,
} from "../types";
@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getMessagesWithStudent(studentId: number, groupId: number): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http
        .get(CHAT_URLS.GET_MESSAGE_WITH_STUDENT(studentId, groupId))
        .subscribe(
          (responseData: any) => {
            observer.next(responseData);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  getMessagesForTeacherInGroup(
    groupId: number
  ): Observable<GetMessagesForTeacherOrStudentInGroupResponse[]> {
    return new Observable(
      (observer: Observer<GetMessagesForTeacherOrStudentInGroupResponse[]>) => {
        this.http
          .get(CHAT_URLS.GET_MESSAGE_FOR_TEACHER_IN_GROUP(groupId))
          .subscribe(
            (responseData: GetMessagesForTeacherOrStudentInGroupResponse[]) => {
              responseData = responseData.map((message) => ({
                ...message,
                align: message.senderStaffId ? "right" : "left",
              }));
              console.log(responseData);
              observer.next(responseData);
            },
            (error) => {
              observer.error(error);
            }
          );
      }
    );
  }

  postMessagesForTeacherToGroup(
    payload: SendMessageToGroupPayload
  ): Observable<GetMessagesForTeacherOrStudentInGroupResponse[]> {
    return new Observable(
      (observer: Observer<GetMessagesForTeacherOrStudentInGroupResponse[]>) => {
        this.http
          .post(CHAT_URLS.POST_TEACHER_SEND_MESSAGE_TO_GROUP, payload)
          .subscribe(
            (responseData: GetMessagesForTeacherOrStudentInGroupResponse[]) => {
              observer.next(responseData);
            },
            (error) => {
              observer.error(error);
            }
          );
      }
    );
  }

  postMessagesForStudentToGroup(
    payload: StudentSendMessageToGroupPayload
  ): Observable<GetMessagesForTeacherOrStudentInGroupResponse[]> {
    return new Observable(
      (observer: Observer<GetMessagesForTeacherOrStudentInGroupResponse[]>) => {
        this.http
          .post(CHAT_URLS.POST_STUDENT_SEND_MESSAGE_TO_GROUP, payload)
          .subscribe(
            (responseData: GetMessagesForTeacherOrStudentInGroupResponse[]) => {
              observer.next(responseData);
            },
            (error) => {
              observer.error(error);
            }
          );
      }
    );
  }
}
