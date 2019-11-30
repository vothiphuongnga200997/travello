import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as Parse from 'parse';
@Component({
    selector: 'ngx-repay',
    templateUrl: './repay.component.html',
    styleUrls: ['./repay.component.scss'],
})
export class RepayComponent implements OnInit {
    settings = {
        actions: {
            add: false,
            edit: false,
            delete: false,
        },
        columns: {
            id: {
                title: 'Id',
                type: 'string',
                editable: true,
            },
            fullname: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            email: {
                title: 'Email',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'string',
                editable: true,
            },
            repay: {
                title: 'Tiền hoàn trả',
                type: 'string',
                editable: true,
            },
            contract: {
                title: 'contract',
                type: 'list',
                editable: true,
            },
            status: {
                title: 'status',
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor() {}

    ngOnInit() {}
    async getRepay() {
        const Repay = Parse.Object.extend('repay');
        const query = new Parse.Query(Repay);
        query.include('objContract');
        let result = await query.find();
        if (result.length > 0) {
            let dataSourses = result.map(res => {
                return {
                    id: res.id,
                    contract: res.get('objContract'),
                    repay: res.get('repay'),
                    status: res.get('status'),
                };
            });
            this.source.load(dataSourses);
        }
    }
}
