import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { RepayComponent, infoRepay } from './repay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
    imports: [ReactiveFormsModule, CommonModule, SharedModule, ThemeModule, FormsModule, NbCardModule, Ng2SmartTableModule],
    exports: [RepayComponent],
    declarations: [RepayComponent, infoRepay],
    entryComponents: [RepayComponent, infoRepay],
})
export class RepayModule {}
