import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }

    constructor(private dialogService: NbDialogService) {}

    ngOnInit() {}
    async addCustom() {
        this.dialogService.open(AddCustomerComponent, {
            context: {
                title: 'Create',
            },
        });
        // .onClose.subscribe();
    }
}
