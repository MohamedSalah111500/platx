// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";

import { FILE_MANAGER_URLS } from "src/app/utiltis/urls";
import { pagination } from "src/app/utiltis/functions";
import {
  CreateFilePayload,
  GetAllFilesResponse,
  GetAllFilesSizeResponse,
} from "../types";

@Injectable({
  providedIn: "root",
})
export class FilemanagerService {
  constructor(private http: HttpClient) {}

  // STUDENTS
  createFile(payload: CreateFilePayload): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http.post(FILE_MANAGER_URLS.CREATE, payload).subscribe(
        (responseData: any) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getAllFiles(
    pageNumber: number,
    pageSize: number
  ): Observable<GetAllFilesResponse> {
    return new Observable((observer: Observer<GetAllFilesResponse>) => {
      this.http
        .get(pagination(FILE_MANAGER_URLS.GET_ALL, pageNumber, pageSize))
        .subscribe(
          (responseData: GetAllFilesResponse) => {
            observer.next(responseData);
          },
          (error) => observer.error(error)
        );
    });
  }

  getAllFilesSize(): Observable<GetAllFilesSizeResponse> {
    return new Observable((observer: Observer<GetAllFilesSizeResponse>) => {
      this.http.get(FILE_MANAGER_URLS.GET_SIZE).subscribe(
        (responseData: GetAllFilesSizeResponse) => {
          observer.next(responseData);
        },
        (error) => observer.error(error)
      );
    });
  }

  // updateStudent(id: string, payload: Student): Observable<Student> {
  //   return new Observable((observer: Observer<Student>) => {
  //     this.http.put<Student>(FILE_MANAGER_URLS.UPDATE, payload).subscribe(
  //       (responseData: Student) => {
  //         observer.next(responseData);
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }

  deleteFile(id: string): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(FILE_MANAGER_URLS.DELETE(id)).subscribe(
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
