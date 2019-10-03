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
    async checkUser(username) {
        const User = Parse.Object.extend('User');
        const query = new Parse.Query(User);
        query.select('username');
        query.equalTo('username', username);

        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async addGuide(data) {
        console.log(data);
        let contract = Parse.Object.extend('contract');
        let tour = Parse.Object.extend('tour');
        let obj = new contract();
        let dataSave: any = {};
        dataSave.infoCustom = data.info.contacts;
        dataSave.objTour = tour.createWithoutData(data.info.tour);
        try {
            let result = await obj.save(dataSave);
            return result;
        } catch (ex) {}
    }
}
