import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { ButtonViewModule } from '../../shared/modules/button-view/button-view.module';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { ManageGuideComponent } from './ManageGuideComponent';
@NgModule({
    imports: [ThemeModule, SharedModule, Ng2SmartTableModule, RouterModule, ButtonViewModule, DialogModule],
    exports: [ManageGuideComponent],
    declarations: [ManageGuideComponent],
    entryComponents: [ManageGuideComponent],
})
export class ManageGuideModule {}
