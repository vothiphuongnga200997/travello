import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ReportWorkFlowComponent } from './report.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { SharedModule } from '../../shared/share.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
    imports: [ThemeModule, SharedModule, Ng2SmartTableModule],
    exports: [ReportWorkFlowComponent],
    declarations: [ReportWorkFlowComponent, DateFilterComponent],
})
export class ReportWorkFlowModule {}
