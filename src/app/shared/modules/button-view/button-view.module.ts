import { NgModule } from '@angular/core';
import { ButtonViewComponent } from './button-view.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    exports: [ButtonViewComponent],
    declarations: [ButtonViewComponent],
    entryComponents: [ButtonViewComponent],
})
export class ButtonViewModule {}
