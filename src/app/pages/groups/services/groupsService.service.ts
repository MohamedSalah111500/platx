import { Injectable } from "@angular/core";
import { User } from "src/app/store/Authentication/auth.models";
import { Observable, Observer, from, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GROUPS_URLS } from "src/app/utiltis/urls";
import {
  CreateGroupAPIPayload,
  CreateGroupAPIResponse,
  GetAllGroupsResponse,
  GetAllStudentsResponse,
  prettify,
} from "../types";
import { pagination } from "src/app/utiltis/functions";

@Injectable({ providedIn: "root" })
export class GroupsService {
  user: User;

  constructor(private http: HttpClient) {}

  createGroup(
    payload: prettify<CreateGroupAPIPayload>
  ): Observable<CreateGroupAPIResponse> {
    return new Observable((observer: Observer<CreateGroupAPIResponse>) => {
      this.http
        .post(GROUPS_URLS.CREATE, payload)
        .subscribe((responseData: CreateGroupAPIResponse) => {
          observer.next(responseData);
        });
    });
  }

  getGroup(id: string): Observable<GetAllGroupsResponse> {
    return new Observable((observer: Observer<GetAllGroupsResponse>) => {
      this.http
        .get(GROUPS_URLS.GET_GROUP(id))
        .subscribe((responseData: GetAllGroupsResponse) => {
          observer.next(responseData);
        });
    });
  }

  getGroupStudents(
    id: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<GetAllStudentsResponse> {
    return new Observable((observer: Observer<GetAllStudentsResponse>) => {
      this.http
        .get(
          pagination(GROUPS_URLS.GET_GROUP_STUDENTS(id), pageNumber, pageSize)
        )
        .subscribe((responseData: GetAllStudentsResponse) => {
          observer.next(responseData);
        });
    });
  }

  getAllGroups(
    pageNumber: number,
    pageSize: number
  ): Observable<GetAllGroupsResponse> {
    return new Observable((observer: Observer<GetAllGroupsResponse>) => {
      this.http
        .get(pagination(GROUPS_URLS.GET, pageNumber, pageSize))
        .subscribe((responseData: GetAllGroupsResponse) => {
          observer.next(responseData);
        });
    });
  }

  patchMoveStudentFromGroup(
    groupId: string,
    studentId: string,
    newGroupId: string
  ): Observable<GetAllGroupsResponse> {
    return new Observable((observer: Observer<any>) => {
      this.http
        .patch(GROUPS_URLS.PATCH_STUDENT(groupId, studentId, newGroupId), null)
        .subscribe(() => {
          observer.next({ message: "done" });
        });
    });
  }

  removeStudentFromGroup(groupId: string, studentId: number): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(GROUPS_URLS.REMOVE_STUDENT_FROM_GROUP(groupId,studentId)).subscribe(
        () => {
          observer.next();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
