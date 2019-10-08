import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [HomeComponent],
    declarations: [HomeComponent],
})
export class HomeModule {}
