import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu.component';
import { BannerModule } from '../banner/banner.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCarouselModule } from 'ngx-carousel';
import { HttpModule } from '@angular/http';
import { FindComponent } from './find.component';
@NgModule({
    imports: [
        ReactiveFormsModule,
        HttpModule,
        NgxCarouselModule,
        NgbModule,
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        BannerModule,
    ],
    exports: [HomeComponent, MenuComponent, FindComponent],
    declarations: [HomeComponent, MenuComponent, FindComponent],
})
export class HomeModule {}
