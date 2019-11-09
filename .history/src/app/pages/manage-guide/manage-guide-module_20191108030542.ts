import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { ButtonViewModule } from '../../shared/modules/button-view/button-view.module';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { ManageGuideComponent, ButtonViewComponent } from './manage-guide.component';
import { AddGuideComponent } from './add-guide/add-guide.component';
import { TaskGuideComponent, ButtonComponent } from './task-guide/task-guide.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbInputModule, NbIconModule, NbTabsetModule, NbSpinnerModule } from '@nebular/theme';
@NgModule({
    imports: [
        NbInputModule,
        NbButtonModule,
        ThemeModule,
        SharedModule,
        Ng2SmartTableModule,
        RouterModule,
        ButtonViewModule,
        DialogModule,
        NbCardModule,
        FormsModule,
        ReactiveFormsModule,
        NbIconModule,
        NbTabsetModule,
        NbSpinnerModule,
    ],
    exports: [ManageGuideComponent, ButtonViewComponent],
    declarations: [ManageGuideComponent, ButtonViewComponent, AddGuideComponent, TaskGuideComponent, ButtonComponent],
    entryComponents: [ManageGuideComponent, ButtonViewComponent, AddGuideComponent, TaskGuideComponent, ButtonComponent],
})
export class ManageGuideModule {}
