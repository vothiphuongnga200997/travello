import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { ManageCustomerComponent } from './manage-customer.component';
import { NbCardModule } from '@nebular/theme';
import { FormComponent } from './form/form.component';
@NgModule({
    imports: [, ThemeModule, SharedModule, Ng2SmartTableModule, RouterModule, ButtonViewModule, DialogModule, NbCardModule],
    exports: [ManageCustomerComponent],
    declarations: [ManageCustomerComponent, FormComponent],
    entryComponents: [ManageCustomerComponent, FormComponent],
})
export class ManageCustomerModule {}
