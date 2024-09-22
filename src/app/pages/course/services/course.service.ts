import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { CHAT_URLS, GRADES_URLS, UNIT_URLS } from "src/app/utiltis/urls";
import { ToastrService } from "ngx-toastr";
import {
  IGeneralErrorMessageResponse,
  IGeneralSuccessMessageResponse,
} from "src/app/shared/general-types";
import { CreateGradePayload, GetGradeResponse, GetUnitsInGradeResponse, Grade, Units } from "../types";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient, private toasty: ToastrService) {}

  postCreateGrades(
    payload: FormData | CreateGradePayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.post(GRADES_URLS.CREATE, payload).subscribe(
          (res: any) => {
            this.toasty.success(res.message, "Grade");
            observer.next(res);
          },
          (error) => {
            this.toasty.error(error.message, "Grade");
            observer.error(error);
          }
        );
      }
    );
  }

  getGrades(): Observable<Grade[]> {
    return new Observable((observer: Observer<Grade[]>) => {
      this.http.get(GRADES_URLS.GET).subscribe(
        (res: Grade[]) => {
          observer.next(res);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getUnitsByGradeId(gradeId: number): Observable<Units[]> {
    return new Observable((observer: Observer<Units[]>) => {
      this.http.get(UNIT_URLS.GET_UNITES_IN_GRADE(gradeId)).subscribe(
        (res: Units[]) => {
          observer.next(res);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
