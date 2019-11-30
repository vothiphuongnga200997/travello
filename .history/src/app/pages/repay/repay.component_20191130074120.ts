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
                editable: false,
            },
            status: {
                title: 'status',
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor() {
        this.getRepay();
    }

    ngOnInit() {}

    async getRepay() {
        const Repay = Parse.Object.extend('repay');
        const query = new Parse.Query(Repay);
        query.include('objContract');
        let list = [];
        let result = await query.find();
        if (result.length > 0) {
            for (let res of result) {
                const queryUser = new Parse.Query(Parse.User);
                queryUser.select('username', 'fullname', 'phone', 'email');
                queryUser.lessThan('status', 0);
                try {
                    let resultUser = await query.first({ useMasterKey: true });
                    if(resultUser){
                        list.push({
                            res: res,
                            id: res.id,
                            fullname: res.get('fullname'),
                            email: resultUser.get('email'),
                            phone: resultUser.get('phone'),
                            repay: res.get('repay'),
                        });
                    }
                } catch (ex) {
                    throw ex;
                }
                
            this.source.load(list);
        }
    }
}
