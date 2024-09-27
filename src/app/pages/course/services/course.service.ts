import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { CHAT_URLS, GRADES_URLS, UNIT_URLS } from "src/app/utiltis/urls";
import { ToastrService } from "ngx-toastr";
import {
  IGeneralErrorMessageResponse,
  IGeneralSuccessMessageResponse,
} from "src/app/shared/general-types";
import {
  CreateGradePayload,
  CreateUpdateUnitPayload,
  GetGradeResponse,
  GetUnitsInGradeResponse,
  Grade,
  PutGradesPayload,
  Unit,
} from "../types";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient, private toasty: ToastrService) {}

  postCreateGrade(
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

  postCreateUnit(
    payload: CreateUpdateUnitPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.post(UNIT_URLS.CREATE, payload).subscribe(
          (res: any) => {
            this.toasty.success(res.message, "Unit");
            observer.next(res);
          },
          (error) => {
            this.toasty.error(error.message, "Unit");
            observer.error(error);
          }
        );
      }
    );
  }

  putUpdateUnit(
    payload: CreateUpdateUnitPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.put(UNIT_URLS.CREATE, payload).subscribe(
          (res: any) => {
            this.toasty.success(res.message, "Unit");
            observer.next(res);
          },
          (error) => {
            this.toasty.error(error.message, "Unit");
            observer.error(error);
          }
        );
      }
    );
  }

  putGrade(
    payload: PutGradesPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.put(GRADES_URLS.CREATE, payload).subscribe(
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

  deleteGrade(gradeId: number): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.delete(GRADES_URLS.DELETE(gradeId)).subscribe(
          (res: IGeneralSuccessMessageResponse) => {
            this.toasty.success(res.message, "Grade");
            observer.next(res);
          },
          (error: IGeneralErrorMessageResponse) => {
            this.toasty.success(error.message, "Grade");
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

  getUnitsByGradeId(gradeId: number): Observable<Unit[]> {
    return new Observable((observer: Observer<Unit[]>) => {
      this.http.get(UNIT_URLS.GET_UNITES_IN_GRADE(gradeId)).subscribe(
        (res: Unit[]) => {
          observer.next(res);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
