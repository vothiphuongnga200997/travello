import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/share.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { WatchInfoComponent } from './watch-info.component';
import { ChangeInfoComponent } from './function/change-info.component';
import { EditContractComponent } from '../../pages/contract/add-customer/edit-contract.component';
@NgModule({
    imports: [CommonModule, SharedModule, ThemeModule, FormsModule],
    exports: [WatchInfoComponent, ChangeInfoComponent],
    declarations: [WatchInfoComponent, ChangeInfoComponent, EditContractComponent],
    entryComponents: [EditContractComponent],
})
export class WatchInfoModule {}
