import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { ButtonStatusEnum, DialogInterface } from '../../shared/interface';
@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class DeleteComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
