import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';
import { FileManagerRoutingModule } from './filemanager-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FilemanagerComponent } from './components/filemanager/filemanager.component';

// dropzone

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { provideNgxMask } from 'ngx-mask';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://h',
  dictCancelUpload: '1',
  maxFilesize: 50,
  maxFiles: 1,
  acceptedFiles:"image/*,application/pdf,.doc,.docx,.xls,.xlsx",
};


@NgModule({
  declarations: [FilemanagerComponent],
  imports: [
    CommonModule,
    FileManagerRoutingModule,
    WidgetModule,
    UIModule,
    NgSelectModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    DropzoneModule
  ],
  providers: [provideNgxMask(), {
    provide: DROPZONE_CONFIG,
    useValue: DEFAULT_DROPZONE_CONFIG
  }]
})
export class FileManagereModule { }
