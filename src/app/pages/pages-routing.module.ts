import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { QuanLyTourComponent } from './qly-tour/qly-tour.component';
import { QlyKhachHangComponent } from './qly-khach-hang/qly-khach-hang.component';
import { QlyNhanVienComponent } from './qly-nhan-vien/qly-nhan-vien.component';
import { HopDongComponent } from './hop-dong/hop-dong.component';
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
                component: QuanLyTourComponent,
            },
            {
                path: 'qlkh',
                component: QlyKhachHangComponent,
            },
            {
                path: 'qlnv',
                component: QlyNhanVienComponent,
            },
            {
                path: 'hopDong',
                component: HopDongComponent,
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
