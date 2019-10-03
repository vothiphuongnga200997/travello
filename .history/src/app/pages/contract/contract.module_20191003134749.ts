import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractComponent } from './contract.component';
import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule, NbSelectModule } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';

@NgModule({
    imports: [
        NbSelectModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        NbAccordionModule,
        NbCardModule,
        DialogModule,
    ],
    exports: [ContractComponent],
    declarations: [ContractComponent, AddCustomerComponent],
    entryComponents: [ContractComponent, AddCustomerComponent],
})
export class ContractModule {}
