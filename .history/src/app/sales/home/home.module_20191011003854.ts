import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu.component';
import { BannerModule } from '../banner/banner.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    imports: [NgbModule, CommonModule, SharedModule, ThemeModule, FormsModule, BannerModule],
    exports: [HomeComponent, MenuComponent],
    declarations: [HomeComponent, MenuComponent],
})
export class HomeModule {}
