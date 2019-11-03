import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../shared/share.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { AddTourComponent } from './add-tour/add-tour.component';
import { EditTourComponent } from './add-tour/edit-tour.component';
import { HttpModule } from '@angular/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { ManageTourComponent } from './manage-tour.component';
import { NgxCurrencyModule } from 'ngx-currency';
import {
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbPopoverModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbSpinnerModule,
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { DialogModule } from '../../shared/modules/dialog/dialog.module';
import { ExportAsModule } from 'ngx-export-as';
import { DetailComponent } from './detail/detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    imports: [
        NgbModule,
        NbCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        ThemeModule,
        SharedModule,
        Ng2SmartTableModule,
        CommonModule,
        HttpModule,
        Ng2CompleterModule,
        NgxCurrencyModule,
        NbCardModule,
        NbSelectModule,
        NbInputModule,
        NbButtonModule,
        CKEditorModule,
        NbPopoverModule,
        NbAccordionModule,
        DialogModule,
        ExportAsModule,
        NbTabsetModule,
        NbSpinnerModule,
    ],
    exports: [ManageTourComponent],
    declarations: [ManageTourComponent, EditTourComponent, AddTourComponent, DetailComponent],
    entryComponents: [ManageTourComponent, EditTourComponent, AddTourComponent, DetailComponent],
})
export class ManageTourModule {}
