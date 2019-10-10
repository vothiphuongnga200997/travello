import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { DetailComponent } from './detail.component';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule],
    exports: [DetailComponent],
    declarations: [DetailComponent],
})
export class DetailModule {}
