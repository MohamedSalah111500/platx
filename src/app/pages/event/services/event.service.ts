// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";

import {
  EVENT_DETAILS_URLS,
  EVENT_URLS,
  FILE_MANAGER_URLS,
} from "src/app/utiltis/urls";
import {
  convertBackendEventToFullCalendarEvent,
  pagination,
} from "src/app/utiltis/functions";
import { ICreateEventPayload, IEvent } from "../types";
import {
  IGeneralErrorMessageResponse,
  IGeneralSuccessMessageResponse,
} from "src/app/shared/general-types";
import { EventInput } from "@fullcalendar/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class EventService {
  constructor(private http: HttpClient, public toastr: ToastrService) {}

  getAllEventsDetails(
    date: string,
    viewType: number
  ): Observable<EventInput[]> {
    return new Observable((observer: Observer<EventInput[]>) => {
      this.http.get(EVENT_DETAILS_URLS.GET_ALL(date, viewType)).subscribe(
        (res: IEvent[]) => {
          let calendarEvents: EventInput[] = [];
          res.map((event) => {
            calendarEvents.push(convertBackendEventToFullCalendarEvent(event));
          });
          observer.next(calendarEvents);
        },
        (error) => observer.error(error)
      );
    });
  }

  postCreateEvent(
    payload: ICreateEventPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.post(EVENT_URLS.CREATE, payload).subscribe(
          (res: IGeneralSuccessMessageResponse) => {
            observer.next(res);
            this.toastr.success(res.message, "Event");
          },
          (error) => {
            observer.error(error);
          }
        );
      }
    );
  }

  // getAllFilesSize(): Observable<GetAllFilesSizeResponse> {
  //   return new Observable((observer: Observer<GetAllFilesSizeResponse>) => {
  //     this.http.get(FILE_MANAGER_URLS.GET_SIZE).subscribe(
  //       (responseData: GetAllFilesSizeResponse) => {
  //         observer.next(responseData);
  //       },
  //       (error) => observer.error(error)
  //     );
  //   });
  // }

  // updateStudent(payload: UpdateFilePayload ): Observable<IGeneralSuccessMessageResponse> {
  //   return new Observable(
  //     (observer: Observer<IGeneralSuccessMessageResponse>) => {
  //       this.http.put(FILE_MANAGER_URLS.UPDATE, payload).subscribe(
  //         (responseData: IGeneralSuccessMessageResponse) => {
  //           observer.next(responseData);
  //         },
  //         (error: IGeneralErrorMessageResponse) => {
  //           observer.error(error);
  //         }
  //       );
  //     }
  //   );
  // }

  // deleteFile(id: string): Observable<void> {
  //   return new Observable((observer: Observer<void>) => {
  //     this.http.delete<void>(FILE_MANAGER_URLS.DELETE(id)).subscribe(
  //       () => {
  //         observer.next();
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }
}
