import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { ManageTourComponent } from './manage-tour/manage-tour.component';
import { ManageGuideComponent } from './manage-guide/manage-guide.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { ContractComponent } from './contract/contract.component';
import { BookTourComponent } from './book-tour/book-tour.component';
import { HomeComponent } from './home/home.component';
import { SelectTourComponent } from './select-tour/select-tour.component';
import { from } from 'rxjs';
const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
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
                path: 'book-tour',
                component: BookTourComponent,
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            // { path: 'select-tour/:id', component: SelectTourComponent },

            // { path: 'home', component: HomeComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
