import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './components/calender/calendar.component';
import { CreateEditEventComponent } from './components/create-edit-event/create-edit-event.component';
import { EventRoutingModule } from './event-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormModule } from '../form/form.module';


@NgModule({
  declarations: [CalendarComponent,  CreateEditEventComponent],
  imports: [
    CommonModule,
    FormsModule,
    EventRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    ModalModule,
    UIModule,
    FullCalendarModule,
    FormModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),

  ],
})
export class EventModule { }
