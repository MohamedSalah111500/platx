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
import {  ICreateUpdateEventPayload, IEvent, IGetEventResponse } from "../types";
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

  getEventsDetails(id: number): Observable<IGetEventResponse> {
    return new Observable((observer: Observer<IGetEventResponse>) => {
      this.http.get(EVENT_DETAILS_URLS.GET_EVENT(id)).subscribe(
        (res: IGetEventResponse) => observer.next(res),
        (error) => observer.error(error)
      );
    });
  }

  postCreateEvent(
    payload: ICreateUpdateEventPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.post(EVENT_URLS.CREATE, payload).subscribe(
          (res: IGeneralSuccessMessageResponse) => {
            observer.next(res);
          },
          (error) => {
            observer.error(error);
          }
        );
      }
    );
  }

  putUpdateEvent(
    payload: ICreateUpdateEventPayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.put(EVENT_DETAILS_URLS.UPDATE, payload).subscribe(
          (res: IGeneralSuccessMessageResponse) => {
            observer.next(res);
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

  deleteEvent(mainEventId: number, eventDetailsId: number): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http
        .delete<void>(EVENT_DETAILS_URLS.DELETE(mainEventId, eventDetailsId))
        .subscribe(
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
