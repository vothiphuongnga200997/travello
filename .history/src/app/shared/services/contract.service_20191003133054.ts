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
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
