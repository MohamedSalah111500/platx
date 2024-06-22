import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UIModule } from '../../shared/ui/ui.module';
import { NewsRoutingModule } from './news-routing.module';

import { NewslistComponent } from './newslist/newslist.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
    declarations: [NewslistComponent, DetailComponent],
    imports: [
        CommonModule,
        NewsRoutingModule,
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        UIModule,
    ]
})

export class NewsModule { }
