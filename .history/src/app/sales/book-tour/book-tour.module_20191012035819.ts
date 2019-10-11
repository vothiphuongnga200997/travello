import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { BookTourComponent } from './book-tour.component';
import {
    NbStepperModule,
    NbCardModule,
    NbAccordionModule,
    NbButtonModule,
    NbRouteTabsetModule,
    NbUserModule,
    NbSelectModule,
    NbRadioModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';
@NgModule({
    imports: [
        NgxPayPalModule,
        NbRadioModule,
        NbAccordionModule,
        NbButtonModule,
        NbCardModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        ThemeModule,
        FormsModule,
        NbStepperModule,
    ],
    exports: [BookTourComponent],
    declarations: [BookTourComponent],
})
export class BookTourTourModule {}
