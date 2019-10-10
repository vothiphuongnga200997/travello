import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginModule } from './login/login.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/share.module';
import { HomeModule } from './home/home.module';
import { NbMenuModule, NbLayoutModule } from '@nebular/theme';
import { SelectTourModule } from './select-tour/select-tour.module';
import { BookTourTourModule } from './book-tour/book-tour.module';
import { BannerModule } from './banner/banner.module';
import { DetailModule } from './detail/detail.module';
import { from } from 'rxjs';
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
    imports: [
        BannerModule,
        NbLayoutModule,
        PagesRoutingModule,
        ThemeModule,
        SharedModule,
        LoginModule,
        HomeModule,
        NbMenuModule,
        SelectTourModule,
        BookTourTourModule,
        DetailModule,
    ],
    exports: [PagesComponent],

    declarations: [...PAGES_COMPONENTS, PagesComponent],
    entryComponents: [],
})
export class SalesModule {}
