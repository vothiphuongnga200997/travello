import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { BookTourComponent } from './book-tour.component';
import { NbStepperModule, NbCardModule } from '@nebular/theme';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule, NbStepperModule, NbCardModule],
    exports: [BookTourComponent],
    declarations: [BookTourComponent],
})
export class BookTourTourModule {}
