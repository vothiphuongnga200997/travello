import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractComponent } from './contract.component';
import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule, NbSelectModule, NbButtonModule, NbInputModule, NbCheckboxModule } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { Ng2CompleterModule } from 'ng2-completer';
import { DeleteComponent } from './delete-customer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ExportAsModule } from 'ngx-export-as';
import { EditContractComponent } from './edit-contract.component';
@NgModule({
    imports: [
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
    ],
    exports: [ContractComponent],
    declarations: [ContractComponent, AddCustomerComponent, DeleteComponent, EditContractComponent],
    entryComponents: [ContractComponent, AddCustomerComponent, DeleteComponent, EditContractComponent],
})
export class ContractModule {}
