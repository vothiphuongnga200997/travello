import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { BannerComponent } from './banner.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [NgbModule, CommonModule, SharedModule, ThemeModule],
    exports: [BannerComponent],
    declarations: [BannerComponent],
})
export class BannerModule {}
