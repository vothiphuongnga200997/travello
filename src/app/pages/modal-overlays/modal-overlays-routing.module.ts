import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalOverlaysComponent } from './modal-overlays.component';
import { WindowComponent } from './window/window.component';

const routes: Routes = [
    {
        path: '',
        component: ModalOverlaysComponent,
        children: [
            {
                path: 'window',
                component: WindowComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModalOverlaysRoutingModule {}
