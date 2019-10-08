import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { ContractComponent } from './contract.component';
import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';

@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule, NbAccordionModule, NbCardModule],
    exports: [ContractComponent, AddCustomerComponent],
    declarations: [ContractComponent, AddCustomerComponent],
})
export class ContractModule {}
