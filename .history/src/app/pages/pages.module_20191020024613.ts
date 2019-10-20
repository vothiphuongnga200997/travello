import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginModule } from './login/login.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/share.module';
import { NbMenuModule } from '@nebular/theme';
import { ManageCustomerModule } from './manage-customer/manage-customer.module';
import { ManageGuideModule } from './manage-guide/manage-guide-module';
import { ManageTourModule } from './manage-tour/manage-tour.module';
import { ManageLocationModule } from './manage-location/manage-location.module';
import { ContractModule } from './contract/contract.module';
import { ChartsModule } from './charts/charts.module';
import { from } from 'rxjs';
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        SharedModule,
        LoginModule,
        ContractModule,
        NbMenuModule,
        ManageLocationModule,
        ManageCustomerModule,
        ManageGuideModule,
        ManageTourModule,
        ChartsModule,
    ],
    exports: [PagesComponent],

    declarations: [...PAGES_COMPONENTS, PagesComponent],
    entryComponents: [],
})
export class PagesModule {}
