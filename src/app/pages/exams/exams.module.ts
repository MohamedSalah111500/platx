import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DndModule } from 'ngx-drag-drop';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ExamsRoutingModule } from './exams-routing.module';
import { UIModule } from '../../shared/ui/ui.module';

import { ListComponent } from './components/list/list.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NewExamComponent } from './components/new-exam/new-exam.component';
import { FieldsComponent } from './components/fields/fields.component';
import { ChoosesComponent } from './components/chooses/chooses.component';

@NgModule({
  declarations: [ListComponent, NewExamComponent,ChoosesComponent],
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    NgSelectModule,
    FieldsComponent,JsonPipe,FormsModule,
    ReactiveFormsModule,
    ExamsRoutingModule,
    UIModule,
    NgApexchartsModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    CKEditorModule,
    DndModule,
    BsDropdownModule.forRoot()
  ]
})
export class ExamsModule { }
