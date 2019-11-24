import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import * as moment from 'moment';

@Component({
    selector: 'ngx-contract-cancel',
    templateUrl: './contract-cancel.component.html',
    styleUrls: ['./contract-cancel.component.scss'],
})
export class ContractCancelComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
    async getContractCanceled() {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objSchedule');
        query.include('objUser');
        query.equalTo('status', false);
        query.descending('date');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
