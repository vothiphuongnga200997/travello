import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { SelectTourComponent } from './select-tour.component';
import { ModalModule, TooltipModule, PopoverModule, ButtonsModule } from 'ng-uikit-pro-standard';
@NgModule({
    imports: [ModalModule, TooltipModule, PopoverModule, ButtonsModule.CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [SelectTourComponent],
    declarations: [SelectTourComponent],
})
export class SelectTourModule {}
