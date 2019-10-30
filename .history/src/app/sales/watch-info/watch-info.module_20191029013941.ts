import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { WatchInfoComponent } from './watch-info.component';
import { ChangeInfoComponent } from './function/change-info.component';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [WatchInfoComponent, ChangeInfoComponent],
    declarations: [WatchInfoComponent, ChangeInfoComponent],
})
export class WatchInfoModule {}
