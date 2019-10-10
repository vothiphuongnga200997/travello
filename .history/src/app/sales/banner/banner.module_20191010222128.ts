import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { BannerComponent } from './banner.component';
import { NguCarouselModule } from '@ngu/carousel';

@NgModule({
    imports: [NguCarouselModule, CommonModule, SharedModule, ThemeModule],
    exports: [BannerComponent],
    declarations: [BannerComponent],
})
export class BannerModule {}
