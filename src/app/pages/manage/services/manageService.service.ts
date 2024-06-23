// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import {
  Role,
  GetAllRolesResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types";
import { ROLES_URLS } from "src/app/utiltis/urls";

@Injectable({
  providedIn: "root",
})
export class ManageService {
  constructor(private http: HttpClient) {}

  getAllRoles(
    pageNumber: number,
    pageSize: number
  ): Observable<GetAllRolesResponse> {
    return new Observable((observer: Observer<GetAllRolesResponse>) => {
      this.http
        .get<GetAllRolesResponse>(ROLES_URLS.GET_ALL(pageNumber, pageSize))
        .subscribe(
          (responseData: GetAllRolesResponse) => {
            observer.next(responseData);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  getRoleById(id: number): Observable<Role> {
    return new Observable((observer: Observer<Role>) => {
      this.http.get<Role>(ROLES_URLS.GET_BY_ID(id)).subscribe(
        (responseData: Role) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  createRole(payload: CreateRoleRequest): Observable<Role> {
    return new Observable((observer: Observer<Role>) => {
      this.http.post<Role>(ROLES_URLS.CREATE, payload).subscribe(
        (responseData: Role) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  updateRole(id: number, payload: UpdateRoleRequest): Observable<Role> {
    return new Observable((observer: Observer<Role>) => {
      this.http.put<Role>(ROLES_URLS.UPDATE(id), payload).subscribe(
        (responseData: Role) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  deleteRole(id: number): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(ROLES_URLS.DELETE(id)).subscribe(
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
