import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { RepayComponent, pay, codeContract } from './repay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
@NgModule({
    imports: [DialogModule, ReactiveFormsModule, CommonModule, SharedModule, ThemeModule, FormsModule, NbCardModule, Ng2SmartTableModule],
    exports: [RepayComponent],
    declarations: [RepayComponent, pay, codeContract],
    entryComponents: [RepayComponent, pay, codeContract],
})
export class RepayModule {}
