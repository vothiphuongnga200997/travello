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
        let contract = Parse.Object.extend('contract');
        let tour = Parse.Object.extend('tour');
        let obj = new contract();
        let dataSave: any = {};
        let dataUser: any = {};
        // dataUser
        // dataUser.username = data.info.username;
        // dataUser.fullName = data.info.representative;
        // dataUser.email = data.info.email;
        // dataUser.password = data.info.phone;
        // dataUser.phone = data.info.phone;
        console.log(dataUser);

        // dataContract
        dataSave.infoCustom = data.info.contacts;
        dataSave.objTour = tour.createWithoutData(data.info.tour);
        dataSave.fullname = data.info.name;
        dataSave.phone = data.info.phone;
        dataSave.birthday = data.info.birthday;
        dataSave.address = data.info.address;
        try {
            let user = await new Parse.User();
            user.set('fullname', data.info.representative);
            user.set('email', data.info.email);
            user.set('username', data.info.username);
            let objUser = await user.save(dataUser);

            if (objUser) {
                dataSave.objUser = user.createWithoutData(objUser.id);
                let result = await obj.save(dataSave);
                console.log(result);
            }
        } catch (ex) {}
    }
}
