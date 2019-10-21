import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable()
export class WatchInfoService {
    constructor() {
        console.log('watch-info');
    }
    async getContrat() {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objTour');
        query.include('objUser');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
