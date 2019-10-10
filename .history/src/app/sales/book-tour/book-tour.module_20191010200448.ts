import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { BookTourComponent } from './book-tour.component';
import {
    NbLayoutModule,
    NbStepperModule,
    NbCardModule,
    NbAccordionModule,
    NbButtonModule,
    NbListModule,
    NbRouteTabsetModule,
    NbTabsetModule,
    NbUserModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NgbModule,
        NbLayoutModule,
        NbAccordionModule,
        NbButtonModule,
        NbCardModule,
        NbListModule,
        NbRouteTabsetModule,
        NbStepperModule,
        NbTabsetModule,
        NbUserModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        NbStepperModule,
        NbCardModule,
    ],
    exports: [BookTourComponent],
    declarations: [BookTourComponent],
})
export class BookTourTourModule {}
