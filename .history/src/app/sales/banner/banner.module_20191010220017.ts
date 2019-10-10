import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from './banner.component';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule],
    exports: [BannerComponent],
    declarations: [BannerComponent],
})
export class LoginModule {}
