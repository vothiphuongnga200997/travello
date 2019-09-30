import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule, NgxPasswordToggleModule],
    exports: [LoginComponent],
    declarations: [LoginComponent],
})
export class LoginModule {}
