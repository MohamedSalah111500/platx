import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';
import { GroupsGridComponent } from './groupsgrid/groupsgrid.component';
import { GroupsListComponent } from './groupslist/groupslist.component';

const routes: Routes = [
    {
        path: '',
        component: GroupsGridComponent
    },
    {
        path: 'list',
        component: GroupsListComponent
    },
    {
        path: 'overview',
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
