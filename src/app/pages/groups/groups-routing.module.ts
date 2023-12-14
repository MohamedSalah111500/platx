import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
    {
        path: '',
        component: GroupsComponent
    },
    {
        path: 'overview/:id',
        component: OverviewComponent
    },
    {
        path: 'create',
        component: CreateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule { }
