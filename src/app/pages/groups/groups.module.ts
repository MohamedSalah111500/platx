import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// routing
import { GroupsRoutingModule } from './groups-routing.module';
import { UIModule } from '../../shared/ui/ui.module';

// simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

// bootstrap component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

// apexchart
import { NgApexchartsModule } from 'ng-apexcharts';

// component
import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { GroupsComponent } from './groups/groups.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [GroupsComponent, OverviewComponent, CreateComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    NgApexchartsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule ,
    PaginationModule.forRoot(),
    SimplebarAngularModule,
    FlatpickrModule.forRoot(),
    TabsModule.forRoot(),
    WidgetModule,
    DropzoneModule,
    CommonModule,
    ModalModule,
    PickerModule

  ],
  providers: [{
    provide: DROPZONE_CONFIG,
    useValue: DEFAULT_DROPZONE_CONFIG
  }]
})

export class GroupsModule { }
