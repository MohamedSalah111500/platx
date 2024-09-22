import { HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { CHAT_URLS } from "src/app/utiltis/urls";
import {
  GetMessagesForTeacherOrStudentInGroupResponse,
  GetStudentsHaveMessagesResponse,
  SendMessageToGroupPayload,
  SendMessageToStudentPayload,
  StudentSendMessageToGroupPayload,
} from "../types";
import { ToastrService } from "ngx-toastr";
import {
  IGeneralErrorMessageResponse,
  IGeneralSuccessMessageResponse,
} from "src/app/shared/general-types";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  public chatDataEmitter = new EventEmitter<SendMessageToStudentPayload>();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  emitStudentChatData(data: any) {
    this.chatDataEmitter.emit(data); // Emit the data
  }

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
              observer.next(responseData);
            },
            (error) => {
              observer.error(error);
            }
          );
      }
    );
  }

  getStudentsHaveMessages(
    teacherId: number
  ): Observable<GetStudentsHaveMessagesResponse[]> {
    return new Observable(
      (observer: Observer<GetStudentsHaveMessagesResponse[]>) => {
        this.http.get(CHAT_URLS.GET_STUDENT_HAVE_MESSAGES(teacherId)).subscribe(
          (responseData: GetStudentsHaveMessagesResponse[]) => {
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

  postMessagesToStudent(
    payload: SendMessageToStudentPayload
  ): Observable<GetMessagesForTeacherOrStudentInGroupResponse[]> {
    return new Observable(
      (observer: Observer<GetMessagesForTeacherOrStudentInGroupResponse[]>) => {
        this.http
          .post(CHAT_URLS.POST_TEACHER_SEND_MESSAGE_TO_STUDENT, payload)
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

  deleteSingleMessages(
    messageId: number
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.delete(CHAT_URLS.DELETE_MESSAGES(messageId)).subscribe(
          (res: IGeneralSuccessMessageResponse) => {
            this.toastr.success(res.message, "Delete Message");
            observer.next(res);
          },
          (error: IGeneralErrorMessageResponse) => {
            this.toastr.success(error.message, "Delete Message");
          }
        );
      }
    );
  }
  deleteGroupMessages(
    groupId: number
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http
          .delete(CHAT_URLS.DELETE_MESSAGES_WITH_GROUP(groupId))
          .subscribe(
            (res: IGeneralSuccessMessageResponse) => {
              this.toastr.success(res.message, "Delete Message");
              observer.next(res);
            },
            (error: IGeneralErrorMessageResponse) => {
              this.toastr.success(error.message, "Delete Message");
            }
          );
      }
    );
  }

  deleteStudentMessages(
    studentId: number
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.delete(CHAT_URLS.DELETE_MESSAGES_WITH_STUDENT(studentId)).subscribe(
          (res: IGeneralSuccessMessageResponse) => {
            this.toastr.success(res.message, "Delete Message");
            observer.next(res);
          },
          (error: IGeneralErrorMessageResponse) => {
            this.toastr.success(error.message, "Delete Message");
          }
        );
      }
    );
  }
}
