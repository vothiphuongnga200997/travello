import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginModule } from './login/login.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/share.module';
import { ReportWorkFlowModule } from './report-workflow/report.module';
import { HomeModule } from './home/home.module';
import { QuanLyTourModule } from './qly-tour/qly-tour.module';
import { HopDongModule } from './hop-dong/hop-dong.module';
import { NbMenuModule } from '@nebular/theme';
import { QlyDiaDiemModule } from './qly-dia-diem/qly-dia-diem.module';
import { ManageCustomerModule } from './manage-customer/manage-customer.module';
import { ManageGuideModule } from './manage-guide/manage-guide-module';
import { ManageTourModule } from './manage-tour/manage-tour.module';
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        SharedModule,
        ReportWorkFlowModule,
        LoginModule,
        HomeModule,
        QuanLyTourModule,
        HopDongModule,
        NbMenuModule,
        QlyDiaDiemModule,
        ManageCustomerModule,
        ManageGuideModule,
        ManageTourModule,
    ],
    exports: [PagesComponent],

    declarations: [...PAGES_COMPONENTS, PagesComponent],
    entryComponents: [],
})
export class PagesModule {}
