import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { ContractComponent } from './contract.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule, BrowserModule, ReactiveFormsModule],
    exports: [ContractComponent],
    declarations: [ContractComponent],
})
export class ContractModule {}
