import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { ContractCancelComponent } from './contract-cancel.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [ReactiveFormsModule, CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [ContractCancelComponent],
    declarations: [ContractCancelComponent],
})
export class ContractCancelModule {}
