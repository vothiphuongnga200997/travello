import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../shared/share.module';
import { QuanLyTourComponent, ButtonViewComponent } from './qly-tour.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { AddTourComponent } from './add-tour/add-tour.component';

@NgModule({
    imports: [ThemeModule, SharedModule, Ng2SmartTableModule, CommonModule],
    exports: [QuanLyTourComponent, ButtonViewComponent],
    declarations: [QuanLyTourComponent, ButtonViewComponent, AddTourComponent],
    entryComponents: [QuanLyTourComponent, ButtonViewComponent, AddTourComponent],
})
export class QuanLyTourModule {}
