import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UsersComponent } from "./users/users.component";
import { UsergridComponent } from "./usergrid/usergrid.component";
import { ProfileComponent } from "../profile/profile.component";
import { StaffComponent } from "./staff/staff.component";
import { StudentsComponent } from "./students/students.component";
import { RolesComponent } from "./roles/roles.component";

const routes: Routes = [
  {
    path: "users",
    component: UsersComponent,
  },
  {
    path: "grid",
    component: UsergridComponent,
  },
  {
    path: "staff",
    component: StaffComponent,
  },
  {
    path: "students",
    component: StudentsComponent,
  },
  {
    path: "roles",
    component: RolesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
