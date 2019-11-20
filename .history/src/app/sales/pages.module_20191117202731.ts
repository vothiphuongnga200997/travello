import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/share.module';
import { HomeModule } from './home/home.module';
import { NbMenuModule, NbLayoutModule } from '@nebular/theme';
import { SelectTourModule } from './select-tour/select-tour.module';
import { BookTourTourModule } from './book-tour/book-tour.module';
import { BannerModule } from './banner/banner.module';
import { DetailModule } from './detail/detail.module';
import { WatchInfoModule } from './watch-info/watch-info.module';
import { ContractModule } from '../pages/contract/contract.module';
import { from } from 'rxjs';
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
    imports: [
        WatchInfoModule,
        BannerModule,
        NbLayoutModule,
        PagesRoutingModule,
        ThemeModule,
        SharedModule,
        HomeModule,
        NbMenuModule,
        SelectTourModule,
        BookTourTourModule,
        DetailModule,
        ContractModule,
    ],
    exports: [PagesComponent],

    declarations: [...PAGES_COMPONENTS, PagesComponent],
    entryComponents: [],
})
export class SalesModule {}
