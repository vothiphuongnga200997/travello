import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { ContractCancelComponent, ButtonComponent, StatusComponent } from './contract-cancel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
    imports: [ReactiveFormsModule, CommonModule, SharedModule, ThemeModule, FormsModule, NbCardModule, Ng2SmartTableModule],
    exports: [ContractCancelComponent],
    declarations: [ContractCancelComponent, ButtonComponent, StatusComponent],
    entryComponents: [ButtonComponent, StatusComponent],
})
export class ContractCancelModule {}
