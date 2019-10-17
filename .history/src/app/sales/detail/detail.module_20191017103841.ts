import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { DetailComponent } from './detail.component';
import { LightboxModule } from 'ngx-lightbox';
import { NgxCarouselModule } from 'ngx-carousel';
import { NbTabsetModule, NbCardModule } from '@nebular/theme';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [CKEditorModule, NbTabsetModule, NbCardModule, NgxCarouselModule, LightboxModule, CommonModule, SharedModule, ThemeModule],
    exports: [DetailComponent],
    declarations: [DetailComponent],
})
export class DetailModule {}
