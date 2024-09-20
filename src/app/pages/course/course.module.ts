import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { TabsModule } from "ngx-bootstrap/tabs";
import { UIModule } from "src/app/shared/ui/ui.module";
import { ListComponent } from "./components/list/list";
import { CourseRoutingModule } from "./course-routing.module";
import { AddUnitModelComponent } from "./components/add-unit-model/add-unit-model.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { AddGradeModelComponent } from "./components/add-grade-model/add-grade-model.component";

@NgModule({
  declarations: [ListComponent,AddUnitModelComponent,AddGradeModelComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    PickerModule,
    TabsModule,
    ModalModule,
    NgSelectModule,
    UIModule
  ],
})
export class CourseModule {}
