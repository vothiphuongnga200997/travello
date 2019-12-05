import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WatchInfoComponent, Paypal } from './watch-info.component';
import { ChangeInfoComponent } from './function/change-info.component';
import { EditInfoComponent } from './edit-info.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NbCheckboxModule, NbSelectModule, NbAccordionModule, NbCardModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { Ng2CompleterModule } from 'ng2-completer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ExportAsModule } from 'ngx-export-as';
import { HomeModule } from '../home/home.module';
@NgModule({
    imports: [
        NgbModule,
        NgbModalModule,
        NbCheckboxModule,
        NbSelectModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        NbAccordionModule,
        NbCardModule,
        DialogModule,
        NgxCurrencyModule,
        Ng2CompleterModule,
        NbButtonModule,
        NbInputModule,
        Ng2SearchPipeModule,
        ExportAsModule,
        Ng2SmartTableModule,
        HomeModule,
    ],
    exports: [WatchInfoComponent, ChangeInfoComponent],
    declarations: [WatchInfoComponent, ChangeInfoComponent, EditInfoComponent, Paypal],
    entryComponents: [EditInfoComponent, Paypal],
})
export class WatchInfoModule {}
