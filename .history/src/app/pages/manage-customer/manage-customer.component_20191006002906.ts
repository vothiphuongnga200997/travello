import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';

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
            id: {
                title: 'Mã giao dịch',
                type: 'string',
                editable: true,
            },
            fullName: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            birthday: {
                title: 'Ngày sinh',
                type: 'date',
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
    source: LocalDataSource = new LocalDataSource();

    constructor(private contractService: ContractService) {
        console.log('custom');
        this.getCustom();
    }

    ngOnInit() {}
    async getCustom() {
        let result = await this.contractService.getContrat();
        if (result) {
            let dataSourses = result.map(res => {
                for (let i of res.get('infoCustom')) {
                    return {
                        id: res.id,
                        fullName: i.name,
                        phone: i.phonecustomer,
                        address: i.address,
                        date: i.phonecustomer,
                        tour: res.get('objTour').get('code'),
                        buyer: res.get('objUser').get('fullname'),
                    };
                }
            });
            this.source.load(dataSourses);
        }
        console.log(result);
    }
}
