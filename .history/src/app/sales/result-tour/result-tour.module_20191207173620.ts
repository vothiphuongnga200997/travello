import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ResultTourComponent} from './result-tour.component';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule, ReactiveFormsModule],
    exports: [ResultTourComponent],
    declarations: [ResultTourComponent],
})
export class ResultTourTourModule {}
