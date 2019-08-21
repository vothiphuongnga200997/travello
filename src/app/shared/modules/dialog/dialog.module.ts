import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';

import { NbCardModule } from '@nebular/theme';

@NgModule({
    imports: [NbCardModule],
    exports: [DialogComponent],
    declarations: [DialogComponent],
})
export class DialogModule {}
