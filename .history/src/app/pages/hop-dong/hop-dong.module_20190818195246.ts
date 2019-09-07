import * as core from '@angular/core';
import { CommonModule } from '@angular/common';
import { HopDongComponent } from './hop-dong.component';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
@core.NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [HopDongComponent],
    declarations: [HopDongComponent],
})
export class HopDongModule {}
