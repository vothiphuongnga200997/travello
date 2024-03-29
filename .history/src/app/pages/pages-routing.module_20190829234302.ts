import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { QuanLyTourComponent } from './qly-tour/qly-tour.component';
import { HopDongComponent } from './hop-dong/hop-dong.component';
import { QlyDiaDiemComponent } from './qly-dia-diem/qly-dia-diem.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { ManageTourComponent } from './manage-tour/manage-tour.component';
import { ManageGuideComponent } from './manage-guide/manage-guide.component';
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
                component: HopDongComponent,
            },
            {
                path: 'diaDiem',
                component: QlyDiaDiemComponent,
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
