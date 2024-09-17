import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ChatComponent } from "./components/chat.component";
import { ChatRoutingModule } from "./chat-routing.module";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { SimplebarAngularModule } from "simplebar-angular";
import { TabsModule } from "ngx-bootstrap/tabs";
import { UIModule } from "src/app/shared/ui/ui.module";

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    PickerModule,
    TabsModule,
    SimplebarAngularModule,
    ModalModule,
    UIModule
  ],
})
export class ChatModule {}
