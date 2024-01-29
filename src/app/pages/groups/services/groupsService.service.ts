import { Injectable } from "@angular/core";

import { getFirebaseBackend } from "../../../authUtils";
import { User } from "src/app/store/Authentication/auth.models";
import { Observable, Observer, from, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {  GROUPS_URLS } from "src/app/utiltis/urls";
import { CreateGroupAPIPayload, CreateGroupAPIResponse, GetAllGroupsResponse, prettify } from "../types";
import { pagination } from "src/app/utiltis/functions";

@Injectable({ providedIn: "root" })
export class GroupsService {
  user: User;

  constructor(private http: HttpClient) {}


  createGroup(payload:prettify<CreateGroupAPIPayload>): Observable<CreateGroupAPIResponse> {
    return new Observable((observer: Observer<CreateGroupAPIResponse>) => {
      this.http
        .post(GROUPS_URLS.CREATE, payload)
        .subscribe((responseData: CreateGroupAPIResponse) => {
          observer.next(responseData);
        });
    });
  }

  getAllGroups(pageNumber:number,pageSize:number): Observable<GetAllGroupsResponse> {
    return new Observable((observer: Observer<GetAllGroupsResponse>) => {
      this.http
        .get(pagination(GROUPS_URLS.GET,pageNumber,pageSize))
        .subscribe((responseData: GetAllGroupsResponse) => {
          observer.next(responseData);
        });
    });
  }

}
