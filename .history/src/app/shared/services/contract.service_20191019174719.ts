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
        query.select('code', 'startDay', 'endDay', 'childrenPrice', 'adultPrice');
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
    async addContract(data) {
        let contract = Parse.Object.extend('contract');
        let tour = Parse.Object.extend('tour');
        let obj = new contract();
        let dataSave: any = {};
        dataSave.infoCustom = data.info.contacts;
        dataSave.objTour = tour.createWithoutData(data.info.tour);
        dataSave.price = data.price;
        dataSave.numberAdult = data.info.adult;
        dataSave.numberKids = data.info.kids;

        dataSave.objectId = data.id;
        if (data.info.kids === null) dataSave.numberKids = 0;
        else {
        }
        try {
            if (data.idUser) {
                let user = Parse.Object.extend('User');
                dataSave.objUser = user.createWithoutData(data.idUser);
                let result = await obj.save(dataSave);
                return result;
            } else {
                let user = await new Parse.User();
                user.set('objectId', data.idUser);
                user.set('fullname', data.info.representative);
                user.set('email', data.info.email);
                user.set('username', data.info.username);
                user.set('password', data.info.phone);
                user.set('phone', parseFloat(data.info.phone.toString()));
                user.set('status', -1);
                let objUser = await user.save();

                if (objUser) {
                    dataSave.objUser = objUser;
                    let result = await obj.save(dataSave);
                    return result;
                }
            }
        } catch (ex) {
            console.log(ex);
        }
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
    async getContractId(id) {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.equalTo('objectId', id);
        query.include('objTour');
        query.include('objUser');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async getUser() {
        // const contract = Parse.Object.extend('User');
        const query = new Parse.Query(Parse.User);
        query.select('username', 'fullname', 'phone');
        query.lessThan('status', 0);
        query.include('objTour');

        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async delete(event) {
        const contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);
        query.equalTo('objectId', event);
        let result = await query.first();
        console.log(result);
        try {
            await result.destroy();
            return true;
        } catch (ex) {
            throw ex;
        }
    }
    async booktour(number: any, info: any, totalPrice: number, price: number) {
        let contract = Parse.Object.extend('contract');
        let tour = Parse.Object.extend('tour');
        let obj = new contract();
        let dataSave: any = {};
        let dataUser: any = {};

        dataSave.infoCustom = info.contacts;
        dataSave.objTour = tour.createWithoutData(number.id);
        dataSave.price = price;
        dataSave.numberAdult = number.adult;
        dataSave.numberKids = number.children;
        try {
            let currentUser = Parse.User.current();
            dataUser.email = info.email;
            dataUser.phone = info.phone;
            let user = currentUser.save(dataUser);
            dataSave.objUser = user;
            let result = await obj.save(dataSave);
            return result;
        } catch (ex) {
            console.log(ex);
        }
    }
}
