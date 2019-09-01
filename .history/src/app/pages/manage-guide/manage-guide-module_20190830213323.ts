import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { ButtonViewModule } from '../../shared/modules/button-view/button-view.module';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { ManageGuideComponent, ButtonViewComponent } from './manage-guide.component';
import { AddGuideComponent } from './add-guide/add-guide.component';
@NgModule({
    imports: [ThemeModule, SharedModule, Ng2SmartTableModule, RouterModule, ButtonViewModule, DialogModule],
    exports: [ManageGuideComponent, ButtonViewComponent],
    declarations: [ManageGuideComponent, ButtonViewComponent, AddGuideComponent],
    entryComponents: [ManageGuideComponent, ButtonViewComponent, AddGuideComponent],
})
export class ManageGuideModule {}
