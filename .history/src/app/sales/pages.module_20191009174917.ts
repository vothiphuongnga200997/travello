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
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
    imports: [
        NbLayoutModule,

        PagesRoutingModule,
        ThemeModule,
        SharedModule,
        LoginModule,
        HomeModule,
        NbMenuModule,
        SelectTourModule,
        BookTourTourModule,
    ],
    exports: [PagesComponent],

    declarations: [...PAGES_COMPONENTS, PagesComponent],
    entryComponents: [],
})
export class SalesModule {}
