import {Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EXAM_URLS } from 'src/app/utiltis/urls';
import { paginationWithSearch } from 'src/app/utiltis/functions';
import { GetAllExamsResponse, UpdateExamPayload } from '../types';
import { IGeneralErrorMessageResponse, IGeneralSuccessMessageResponse } from 'src/app/shared/general-types';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private http: HttpClient) {}

  createExam(payload: any): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http.post(EXAM_URLS.CREATE, payload).subscribe(
        (responseData: any) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getAllExams(
    pageNumber: number,
    pageSize: number,
    search: string
  ): Observable<GetAllExamsResponse> {
    return new Observable((observer: Observer<GetAllExamsResponse>) => {
      this.http
        .get(
          paginationWithSearch(
            EXAM_URLS.GET_EXAMS,
            search,
            pageNumber,
            pageSize
          )
        )
        .subscribe(
          (responseData: GetAllExamsResponse) => {
            observer.next(responseData);
          },
          (error) => observer.error(error)
        );
    });
  }



  updateExam(
    payload: UpdateExamPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.put(EXAM_URLS.UPDATE, payload).subscribe(
          (responseData: IGeneralSuccessMessageResponse) => {
            observer.next(responseData);
          },
          (error: IGeneralErrorMessageResponse) => {
            observer.error(error);
          }
        );
      }
    );
  }

  deleteExam(id: string): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(EXAM_URLS.DELETE(id)).subscribe(
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
