import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../shared/share.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { AddTourComponent } from './add-tour/add-tour.component';
import { HttpModule } from '@angular/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { ManageTourComponent, ButtonViewComponent } from './manage-tour.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NbCardModule, NbSelectModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
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
    ],
    exports: [ManageTourComponent],
    declarations: [ManageTourComponent, AddTourComponent, ButtonViewComponent],
    entryComponents: [ManageTourComponent, AddTourComponent, ButtonViewComponent],
})
export class ManageTourModule {}
