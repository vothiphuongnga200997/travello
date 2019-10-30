import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { NbTabsetModule } from '@nebular/theme';
import { TestComponent } from './test.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [ReactiveFormsModule, CommonModule, SharedModule, ThemeModule, FormsModule, NgxPasswordToggleModule, NbTabsetModule],
    exports: [TestComponent],
    declarations: [TestComponent],
})
export class TextModule {}
