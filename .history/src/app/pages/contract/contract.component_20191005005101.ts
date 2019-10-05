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
export class ContractComponent implements OnInit {
    contract: Array<any> = [];
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    @ViewChild('confirmDeleteDialog', { static: true }) deleteDialog: DialogComponent;
    constructor(private toastrService: ToastrService, private dialogService: NbDialogService, private contractService: ContractService) {
        console.log('dgdg');
        this.getContract();
    }

    ngOnInit() {}

    async addCustom() {
        try {
            this.dialogService
                .open(AddCustomerComponent, {
                    context: {
                        title: 'Create',
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        try {
                            let result = await this.contractService.addContract(data);
                            if (result) {
                                await this.getContract();
                                this.toastrService.success(`Add Success`, 'Add success');
                            }
                        } catch (ex) {
                            this.toastrService.error(ex, `Add Error`);
                        }
                    }
                });
        } catch (ex) {
            this.toastrService.error(ex, `Add Error`);
        }
    }
    async getContract() {
        let result = await this.contractService.getContrat();
        this.contract = [];
        if (result) {
            result.map(data => {
                this.contract.push({
                    id: data.id,
                    representative: data.get('objUser').get('fullname'),
                    tour: data.get('objTour').get('code'),
                    idTour: data.get('objTour').id,
                    tourist: data.get('infoCustom'),
                    price: data.get('price'),
                    quantity: data.get('infoCustom').length,
                });
            });
        }
    }
    delete(event) {
        console.log(event);
        this.dialogConfig = {
            title: 'Delete Tour',
            content: `Do you want to delete tour ${event.data.code}?`,
            data: event.data,
            rightBtnLabel: 'OK',
            leftBtnLabel: 'Cancel',
            rightBtnStatus: ButtonStatusEnum.Info,
            leftBtnStatus: ButtonStatusEnum.Hint,
        };
        this.deleteDialog.open();
    }
    async onDelete(event) {
        try {
            let result = 'await';
            if (result) {
                this.toastrService.success(`Delete tour ${event.code} success`, `Delete tour`);
            } else {
                this.toastrService.error(`Delete tour ${event.code} fail`, `Delete tour`);
            }
        } catch (error) {
            this.toastrService.error(error, `Delete tour`);
        }
    }
}
