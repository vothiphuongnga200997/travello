import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../shared/share.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { AddTourComponent } from './add-tour/add-tour.component';
import { HttpModule } from '@angular/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { ManageTourComponent } from './manage-tour.component';
@NgModule({
    imports: [ThemeModule, SharedModule, Ng2SmartTableModule, CommonModule, HttpModule, Ng2CompleterModule],
    exports: [ManageTourComponent],
    declarations: [ManageTourComponent, AddTourComponent],
    entryComponents: [ManageTourComponent, AddTourComponent],
})
export class ManageTourModule {}
