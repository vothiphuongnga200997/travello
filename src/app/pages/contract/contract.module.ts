import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { ContractComponent } from './contract.component';
import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule } from '@nebular/theme';

@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule, NbAccordionModule, NbCardModule],
    exports: [ContractComponent],
    declarations: [ContractComponent],
})
export class ContractModule {}
