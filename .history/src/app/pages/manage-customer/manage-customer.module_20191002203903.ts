import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { ManageCustomerComponent } from './manage-customer.component';
import { NbCardModule } from '@nebular/theme';
import { FormComponent } from './form/form.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, ThemeModule, SharedModule, Ng2SmartTableModule, RouterModule, NbCardModule],
    exports: [ManageCustomerComponent],
    declarations: [ManageCustomerComponent, FormComponent],
    entryComponents: [ManageCustomerComponent, FormComponent],
})
export class ManageCustomerModule {}
