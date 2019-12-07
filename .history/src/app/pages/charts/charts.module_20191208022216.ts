import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { NbTabsetModule, NbCardModule } from '@nebular/theme';
import { ChartsComponent } from './charts.component';
import { CountMonthComponent } from './count-month.component';
import { SumMoneyComponent } from './sum-money.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbSelectModule } from '@nebular/theme';
@NgModule({
    imports: [
        NbSelectModule,
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        NgxPasswordToggleModule,
        NbTabsetModule,
        NgxEchartsModule,
        NbCardModule,
    ],
    exports: [ChartsComponent, CountMonthComponent, SumMoneyComponent],
    declarations: [ChartsComponent, CountMonthComponent, SumMoneyComponent],
})
export class ChartsModule {}
