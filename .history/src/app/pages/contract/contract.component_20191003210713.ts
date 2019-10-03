import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
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

    constructor(private dialogService: NbDialogService, private contractService: ContractService) {
        console.log('dgdg');
    }

    ngOnInit() {}

    async addCustom() {
        console.log('hihih');
        try {
            this.dialogService
                .open(AddCustomerComponent, {
                    context: {
                        title: 'Create',
                    },
                })
                .onClose.subscribe(async data => {
                    try {
                        console.log(data);
                        let result = await this.contractService.addGuide(data);
                    } catch (ex) {
                        throw ex;
                    }
                });
        } catch (ex) {
            console.log(ex);
        }
    }
}
