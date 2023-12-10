import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

// apexchart
import { NgApexchartsModule } from 'ng-apexcharts';

// component
import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { GroupsGridComponent } from './groupsgrid/groupsgrid.component';
import { GroupsListComponent } from './groupslist/groupslist.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [GroupsGridComponent, GroupsListComponent, OverviewComponent, CreateComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    UIModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    NgApexchartsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    SimplebarAngularModule,
    FlatpickrModule.forRoot(),
    WidgetModule,
    DropzoneModule],
  providers: [{
    provide: DROPZONE_CONFIG,
    useValue: DEFAULT_DROPZONE_CONFIG
  }]
})

export class GroupsModule { }
