import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginModule } from './login/login.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/share.module';
import { ReportWorkFlowModule } from './report-workflow/report.module';
import { HomeModule } from './home/home.module';
import { NbMenuModule } from '@nebular/theme';
import { ManageCustomerModule } from './manage-customer/manage-customer.module';
import { ManageGuideModule } from './manage-guide/manage-guide-module';
import { ManageTourModule } from './manage-tour/manage-tour.module';
import { ManageLocationModule } from './manage-location/manage-location.module';
import { ContractComponent } from './contract/contract.component';
import { ContractModule } from './contract/contract.module';
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        SharedModule,
        ReportWorkFlowModule,
        LoginModule,
        HomeModule,
        ContractModule,
        NbMenuModule,
        ManageLocationModule,
        ManageCustomerModule,
        ManageGuideModule,
        ManageTourModule,
    ],
    exports: [PagesComponent],

    declarations: [...PAGES_COMPONENTS, PagesComponent, ContractComponent],
    entryComponents: [],
})
export class PagesModule {}
