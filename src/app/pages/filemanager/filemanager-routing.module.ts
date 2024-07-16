import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FilemanagerComponent } from "./components/filemanager/filemanager.component";


const routes: Routes = [
  {
    path: "",
    component: FilemanagerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileManagerRoutingModule {}
