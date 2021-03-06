import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';

@Injectable()
export class ContractService {
    dataUpdate: Array<any> = [];

    constructor() {
        console.log('contract');
    }
    async getTour() {
        const currentDate = new Date();
        const tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.ascending('startDay');
        query.greaterThan('endDay', currentDate);
        query.select('code', 'startDay', 'endDay');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async getUser() {
        const user = Parse.Object.extend('User');
        const query = new Parse.Query(user);
        query.select('username', 'startDay', 'endDay');
        query.lessThan('status', 0);

        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
