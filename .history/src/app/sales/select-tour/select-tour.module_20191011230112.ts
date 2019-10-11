import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { SelectTourComponent } from './select-tour.component';
import { HomeModule } from '../home/home.module';

@NgModule({
    imports: [HomeModule, CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [SelectTourComponent],
    declarations: [SelectTourComponent],
})
export class SelectTourModule {}
