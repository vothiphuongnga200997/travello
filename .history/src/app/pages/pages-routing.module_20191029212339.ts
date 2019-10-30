import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { ManageTourComponent } from './manage-tour/manage-tour.component';
import { ManageGuideComponent } from './manage-guide/manage-guide.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { ContractComponent } from './contract/contract.component';
import { ChartsComponent } from './charts/charts.component';
import { TestComponent } from './test/test.component';
const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: 'modal-overlays',
                loadChildren: './modal-overlays/modal-overlays.module#ModalOverlaysModule',
            },
            {
                path: 'tour',
                component: ManageTourComponent,
            },
            {
                path: 'qlkh',
                component: ManageCustomerComponent,
            },
            {
                path: 'qlnv',
                component: ManageGuideComponent,
            },
            {
                path: 'hopDong',
                component: ContractComponent,
            },
            {
                path: 'diaDiem',
                component: ManageLocationComponent,
            },
            {
                path: 'charts',
                component: ChartsComponent,
            },
            {
                path: 'test',
                component: TestComponent,
            },
            {
                path: '',
                redirectTo: 'qlnv',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
