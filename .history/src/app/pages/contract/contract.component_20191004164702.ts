import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    contract: Array<any> = [];
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }

    constructor(private toastrService: ToastrService, private dialogService: NbDialogService, private contractService: ContractService) {
        console.log('dgdg');
        this.getContract();
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
                    if(data){
                    try {
                        let result = await this.contractService.addContract(data);
                        if (result) {
                            this.toastrService.success(`Add Success`, 'Add success');
                        }
                    } catch (ex) {
                        this.toastrService.error(ex, `Add Error`);
                    }
                });}
        } catch (ex) {
            console.log(ex);
        }
    }
    async getContract() {
        let result = await this.contractService.getContrat();
        if (result) {
            result.map(data => {
                this.contract.push({
                    representative: data.get('objUser').get('fullname'),
                    tour: data.get('objTour').get('code'),
                    idTour: data.get('objTour').id,
                    tourist: data.get('infoCustom'),
                });
            });
        }
    }
}
