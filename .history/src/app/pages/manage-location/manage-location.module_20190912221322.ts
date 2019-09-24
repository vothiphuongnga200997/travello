import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { ButtonViewModule } from '../../shared/modules/button-view/button-view.module';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { ManageLocationComponent } from './manage-location.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { NbCardModule, NbSelectModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
        ThemeModule,
        SharedModule,
        Ng2SmartTableModule,
        RouterModule,
        ButtonViewModule,
        DialogModule,
        NbCardModule,
        NbSelectModule,
        FormsModule,
    ],
    exports: [ManageLocationComponent],
    declarations: [ManageLocationComponent, AddLocationComponent],
    entryComponents: [ManageLocationComponent, AddLocationComponent],
})
export class ManageLocationModule {}
