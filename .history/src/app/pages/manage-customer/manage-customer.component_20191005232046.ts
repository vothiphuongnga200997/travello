import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    settings = {
        actions: {
            add: false,
            delete: false,
            edit: false,
        },
        columns: {
            fullName: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            birthday: {
                title: 'Ngày sinh',
                type: 'datetime',
                editable: true,
            },
            address: {
                title: 'Địa chỉ',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'number',
                editable: true,
            },
            tour: {
                title: 'Tour',
                type: 'Sting',
                editable: true,
            },
            buyer: {
                tilte: 'Đại diện',
                type: 'Sting',
                editable: true,
            },
        },
    };
    constructor(private contractService: ContractService) {
        console.log('custom');
    }

    ngOnInit() {}
    async getCustom() {
        let result = this.contractService.getContrat();
        console.log(result);
    }
}
