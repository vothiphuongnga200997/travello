import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { WatchInfoComponent } from './watch-info.component';
import { ChangeInfoComponent } from './function/change-info.component';
import { EditInfoComponent } from './edit-info.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NbCheckboxModule, NbSelectModule } from '@nebular/theme';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        NgbModule,
        NgbModalModule,
        NbCheckboxModule,
        NbSelectModule,
        ThemeModule,
        FormsModule,
    ],
    exports: [WatchInfoComponent, ChangeInfoComponent],
    declarations: [WatchInfoComponent, ChangeInfoComponent, EditInfoComponent],
    entryComponents: [EditInfoComponent],
})
export class WatchInfoModule {}
