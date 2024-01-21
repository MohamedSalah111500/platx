import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './components/list/list.component';
import { NewExamComponent } from './components/new-exam/new-exam.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: 'new-exam',
        component: NewExamComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamsRoutingModule { }
