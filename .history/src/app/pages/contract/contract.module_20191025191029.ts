import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractComponent, ButtonViewComponent, StatusTextComponent } from './contract.component';
import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule, NbSelectModule, NbButtonModule, NbInputModule, NbCheckboxModule } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { Ng2CompleterModule } from 'ng2-completer';
import { DeleteComponent, DeleteTicketComponent } from './delete-customer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ExportAsModule } from 'ngx-export-as';
import { EditContractComponent } from './add-customer/edit-contract.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ContractCancelComponent } from './contractCancel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InfoTouristComponent } from './info-tourist/info-tourist.component';
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
    ],
    exports: [ContractComponent, ButtonViewComponent],
    declarations: [
        ContractComponent,
        AddCustomerComponent,
        DeleteComponent,
        EditContractComponent,
        DeleteTicketComponent,
        ContractCancelComponent,
        ButtonViewComponent,
        InfoTouristComponent,
        StatusTextComponent,
    ],
    entryComponents: [
        ContractComponent,
        AddCustomerComponent,
        DeleteComponent,
        EditContractComponent,
        DeleteTicketComponent,
        ContractCancelComponent,
        ButtonViewComponent,
        InfoTouristComponent,
        StatusTextComponent,
    ],
})
export class ContractModule {}
