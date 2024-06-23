import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewslistComponent } from './newslist/newslist.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
    {
        path: '',
        component: NewslistComponent
    },
    {
        path: 'detail',
        component: DetailComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsRoutingModule { }
