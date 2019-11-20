import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { RepayComponent } from './repay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule } from '@nebular/theme';
@NgModule({
    imports: [ReactiveFormsModule, CommonModule, SharedModule, ThemeModule, FormsModule, NbCardModule],
    exports: [RepayComponent],
    declarations: [RepayComponent],
})
export class RepayModule {}
