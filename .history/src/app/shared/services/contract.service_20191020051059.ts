import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable()
export class ContractService {
    dataUpdate: Array<any> = [];

    constructor(private http: HttpClient) {
        console.log('contract');
    }
    async getTour() {
        const currentDate = new Date();
        const tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.ascending('startDay');
        query.greaterThan('endDay', currentDate);
        query.select('code', 'startDay', 'endDay', 'childrenPrice', 'adultPrice', 'empty', 'quantity');
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
        let ObjectTour = new tour();
        let obj = new contract();

        let dataSave: any = {};
        let dataTour: any = {};
        // cập nhật số lượng trống cho tour

        // data Save contract
        dataSave.objTour = tour.createWithoutData(data.info.tour);
        dataSave.infoCustom = data.info.contacts;
        dataSave.price = data.price;
        dataSave.numberAdult = data.info.adult;
        dataSave.numberKids = data.info.kids;

        dataSave.objectId = data.id;
        if (data.info.kids === null) dataSave.numberKids = 0;
        else {
        }
        try {
            // đã có user
            if (data.idUser) {
                let user = Parse.Object.extend('User');
                dataSave.objUser = user.createWithoutData(data.idUser);
                let result = await obj.save(dataSave);
                dataTour.objectId = data.info.tour;
                dataTour.empty = await this.setEmpty(data.info.tour, data.quantity);
                console.log(dataTour.empty);
                let objTour = await ObjectTour.save(dataTour);

                return result;
            } else {
                // tao user
                let user = await new Parse.User();
                user.set('objectId', data.idUser);
                user.set('fullname', data.info.representative);
                user.set('email', data.info.email);
                user.set('username', data.info.username);
                user.set('password', data.info.phone);
                user.set('phone', data.info.phone);
                user.set('status', -1);
                let objUser = await user.save();
                //
                if (objUser) {
                    dataSave.objUser = objUser;
                    let result = await obj.save(dataSave);

                    dataTour.objectId = data.info.tour;
                    dataTour.empty = await this.setEmpty(data.info.tour, data.quantity);
                    console.log(dataTour.empty);
                    let objTour = await ObjectTour.save(dataTour);

                    return result;
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    async editContract(data) {
        let contract = Parse.Object.extend('contract');
        let tour = Parse.Object.extend('tour');
        let obj = new contract();
        let dataSave: any = {};
        dataSave.infoCustom = data.info.contacts;
        dataSave.objTour = tour.createWithoutData(data.info.tour);
        let user = Parse.Object.extend('User');
        dataSave.objUser = user.createWithoutData(data.idUser);
        dataSave.objectId = data.id;
        try {
            let result = await obj.save(dataSave);
            return result;
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
    async booktour(firstForm: any, secondForm: any, totalPrice: number, price: number, empty: number) {
        let contract = Parse.Object.extend('contract');
        let obj = new contract();
        let dataSave: any = {};
        let dataUser: any = {};
        let dataTour: any = {};

        let tour = Parse.Object.extend('tour');
        let ObjectTour = new tour();
        dataTour.objectId = firstForm.idTour;
        dataTour.empty = empty - (firstForm.adult + firstForm.children);
        let objTour = await ObjectTour.save(dataTour);

        dataSave.objTour = objTour;
        dataSave.infoCustom = secondForm.contacts;
        dataSave.price = totalPrice;
        dataSave.deposit = price;
        dataSave.numberAdult = firstForm.adult;
        dataSave.numberKids = firstForm.children;
        try {
            let currentUser = Parse.User.current();
            dataUser.email = secondForm.email;
            dataUser.phone = secondForm.phone;
            currentUser.save(dataUser);
            dataSave.objUser = currentUser;
            let result = await obj.save(dataSave);
            return result;
        } catch (ex) {
            console.log(ex);
        }
    }
    sendMail() {
        return this.http.post(`${environment.config.DOMAIN_URL}/upload`, 'hello');
    }

    booking: number;
    empty: number;
    quantity: number;
    async setEmpty(idTour, quantity) {
        this.booking = 0;
        this.empty = 0;
        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);
        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);

        innerQueryTour.equalTo('objectId', idTour);
        query.matchesQuery('objTour', innerQueryTour);
        let result = await query.find();
        if (result.length > 0) {
            result.map(rep => {
                this.booking += rep.attributes.numberAdult + rep.attributes.numberKids;
            });
        }
        this.empty = quantity - this.booking;
        return this.empty;
    }
}
