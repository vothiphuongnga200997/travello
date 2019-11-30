import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { NbDateAdapterService } from '@nebular/theme';

@Injectable()
export class ContractService {
    dataUpdate: Array<any> = [];

    constructor(private http: HttpClient) {
        console.log('contract');
    }
    async getSchedule() {
        const tour = Parse.Object.extend('schedule');
        const query = new Parse.Query(tour);
        query.ascending('startDay');
        query.include('objTour');
        // query.greaterThan('endDay', currentDate);
        query.select('codeSchedule', 'startDay', 'endDay', 'objTour', 'empty', 'surcharge');
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
        console.log(data);
        // let contract = Parse.Object.extend('contract');
        // let schedule = Parse.Object.extend('schedule');
        // let customer = Parse.Object.extend('customer');
        // let ObjectSchedule = new schedule();
        // let obj = new contract();
        // let objCustomer = new customer();
        // let dataSave: any = {};
        // let dataSchedule: any = {};
        // let dataCustomer: any = {};
        // // cập nhật số lượng trống cho tour

        // // data Save contract
        // dataSave.objSchedule = schedule.createWithoutData(data.info.idSchedule);
        // dataSave.infoCustom = data.info.contacts;
        // dataSave.price = data.price;
        // dataSave.numberAdult = data.info.adult;
        // dataSave.numberKids = data.info.kids;
        // dataSave.paid = data.info.paid;
        // dataSave.cancelContract = [];
        // dataSave.indemnification = 0;
        // dataSave.cancelTicket = [];
        // dataSave.status = true;
        // dataSave.expiryDate = new Date(
        //     moment(Date.now())
        //         .add(3, 'day')
        //         .format('LLL'),
        // );
        // try {
        //     // đã có user
        //     if (data.info.idUser !== '') {
        //         dataSave.objUser = data.info.idUser;
        //         let result = await obj.save(dataSave);
        //         if (result) {
        //             try {
        //                 dataSchedule.objectId = data.info.idSchedule;
        //                 dataSchedule.empty = await this.setEmpty(data.info.idSchedule, data.quantity);
        //                 await ObjectSchedule.save(dataSchedule);
        //                 dataCustomer.objectId = data.idCustomer;
        //                 dataCustomer.objUser = data.info.idUser;
        //                 dataCustomer.paid = data.paidOfCuctomer + data.price;
        //                 dataCustomer.discount = 0;
        //                 if (data.paidOfCuctomer + data.price >= 100000000) dataCustomer.discount = 0.1;
        //                 if (data.paidOfCuctomer + data.price < 100000000 || data.paidOfCuctomer + data.price >= 50000000)
        //                     dataCustomer.discount = 0.05;
        //                 await objCustomer.save(dataCustomer);
        //                 return result;
        //             } catch (ex) {
        //                 throw ex;
        //             }
        //         }
        //     } else {
        //         // tao user
        //         let user = await new Parse.User();
        //         user.set('fullname', data.info.representative);
        //         user.set('email', data.info.email);
        //         user.set('username', data.info.username);
        //         user.set('password', data.info.phone);
        //         user.set('phone', data.info.phone);
        //         user.set('status', -1);
        //         let objUser = await user.save();
        //         //
        //         if (objUser) {
        //             dataSave.objUser = objUser;
        //             let result = await obj.save(dataSave);
        //             if (result) {
        //                 dataSchedule.objectId = data.info.idSchedule;
        //                 dataSchedule.empty = await this.setEmpty(data.info.idSchedule, data.quantity);
        //                 await ObjectSchedule.save(dataSchedule);
        //                 dataCustomer.objectId = data.idCustomer;
        //                 dataCustomer.objUser = data.info.idUser;
        //                 dataCustomer.paid = data.paidOfCuctomer + data.price;
        //                 dataCustomer.discount = 0;
        //                 if (data.paidOfCuctomer + data.price >= 100000000) dataCustomer.discount = 0.1;
        //                 if (data.paidOfCuctomer + data.price < 100000000 || data.paidOfCuctomer + data.price >= 50000000)
        //                     dataCustomer.discount = 0.05;
        //                 await objCustomer.save(dataCustomer);
        //             }
        //             return result;
        //         }
        //     }
        // } catch (ex) {
        //     console.log(ex);
        // }
        return true;
    }
    async editContract(data) {
        let contract = Parse.Object.extend('contract');
        let schedule = Parse.Object.extend('schedule');
        let customer = Parse.Object.extend('customer');
        let objCustomer = new customer();
        let obj = new contract();
        let ObjectSchedule = new schedule();
        let dataSave: any = {};
        let dataSchedule: any = {};
        let dataCustomer: any = {};
        dataSave.infoCustom = data.info.contacts;
        dataSave.objSchedule = schedule.createWithoutData(data.info.tour);
        dataSave.objUser = data.info.idUser;
        dataSave.objectId = data.id;
        dataSave.paid = data.info.paid;
        dataSave.numberAdult = data.info.adult;
        dataSave.numberKids = data.info.kids;
        dataSave.price = data.price;
        try {
            let result = await obj.save(dataSave);
            if (result) {
                dataSchedule.objectId = data.info.tour;
                dataSchedule.empty = await this.setEmpty(data.info.tour, data.quantity);
                await ObjectSchedule.save(dataSchedule);
                dataCustomer.objectId = data.idCustomer;
                dataCustomer.objUser = data.info.idUser;
                dataCustomer.paid = data.paidOfCuctomer + data.price;
                await objCustomer.save(dataCustomer);
                return result;
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    async getContrat() {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objSchedule');
        query.include('objUser');
        query.notEqualTo('infoCustom', []);
        query.equalTo('status', true);

        query.descending('date');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async getContratCancel() {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objSchedule');
        query.include('objUser');
        query.notEqualTo('cancelContract', []);
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
        query.include('objSchedule');
        query.include('objUser');
        try {
            let result = await query.first();
            return result;
        } catch (ex) {
            throw ex;
        }
    }

    async getUserId(idUser) {
        const contract = Parse.Object.extend('User');
        const query = new Parse.Query(Parse.User);
        query.equalTo('objectId', idUser);
        query.select('email');

        try {
            let result = await query.first({ useMasterKey: true });
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async getUser() {
        // const contract = Parse.Object.extend('User');
        const query = new Parse.Query(Parse.User);
        query.select('username', 'fullname', 'phone', 'email');
        query.lessThan('status', 0);
        query.include('objTour');

        try {
            let result = await query.find({ useMasterKey: true });
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async deleteContract(event, idTour, quantity, tourist) {
        const contract = Parse.Object.extend('contract');
        let objContract = new contract();
        let tour = Parse.Object.extend('tour');
        let ObjectTour = new tour();
        let dataTour: any = {};
        let dataSave: any = {};
        // let query = new Parse.Query(contract);
        // query.equalTo('objectId', event);
        dataSave.objectId = event;
        dataSave.cancelContract = tourist;
        dataSave.infoCustom = null;
        // let result = await query.first();

        try {
            let result = await objContract.save(dataSave);
            await result.destroy();
            dataTour.objectId = idTour;
            dataTour.empty = await this.setEmpty(idTour, quantity);
            let objTour = await ObjectTour.save(dataTour);

            return true;
        } catch (ex) {
            throw ex;
        }
    }
    async setEmail(email, fullname) {
        const user = Parse.Object.extend('User');
        const query = new Parse.Query(user);
        let currentUser = Parse.User.current();
        query.select('email');
        query.equalTo('email', email);
        query.notEqualTo('objectId', currentUser.id);
        try {
            let result = await query.first();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async booktour(
        firstForm: any,
        secondForm: any,
        thirdForm: any,
        price: number,
        quantity: number,
        paid: number,
        totalMoney: number,
        paidOfCuctomer: number,
        idCustomer: string,
        surcharge: Array<any>,
    ) {
        let contract = Parse.Object.extend('contract');
        let obj = new contract();
        let dataSave: any = {};
        let dataUser: any = {};
        let dataSchedule: any = {};
        let schedule = Parse.Object.extend('schedule');
        let ObjectSchedule = new schedule();

        let customer = Parse.Object.extend('customer');
        let objCustomer = new customer();
        let dataCustomer: any = {};

        dataSave.objSchedule = schedule.createWithoutData(firstForm.idSchedule);
        dataSave.infoCustom = secondForm.contacts;
        dataSave.price = price;
        dataSave.numberAdult = firstForm.adult;
        dataSave.numberKids = firstForm.children;
        dataSave.indemnification = 0;
        dataSave.cancelTicket = [];
        dataSave.paid = paid;
        dataSave.status = true;
        dataSave.surcharge = surcharge;
        dataSave.expiryDate = new Date(
            moment(Date.now())
                .add(3, 'day')
                .format('LLL'),
        );
        dataSave.date = new Date();
        try {
            let currentUser = Parse.User.current();
            dataUser.email = thirdForm.email;
            dataUser.phone = thirdForm.phone;
            currentUser.save(dataUser);
            dataSave.objUser = currentUser;
            let result = await obj.save(dataSave);
            if (result) {
                dataSchedule.objectId = firstForm.idSchedule;
                dataSchedule.empty = await this.setEmpty(firstForm.idSchedule, quantity);
                await ObjectSchedule.save(dataSchedule);
                dataCustomer.objUser = currentUser;
                dataCustomer.objectId = idCustomer;
                dataCustomer.objUser = currentUser;
                dataCustomer.paid = paidOfCuctomer + totalMoney;
                dataCustomer.discount = 0;
                if (paidOfCuctomer + totalMoney >= 100000000) dataCustomer.discount = 0.1;
                if (paidOfCuctomer + totalMoney < 100000000 && paidOfCuctomer + totalMoney >= 50000000) dataCustomer.discount = 0.05;
                await objCustomer.save(dataCustomer);
            }
            return result;
        } catch (ex) {
            console.log(ex);
        }
    }
    sendMail(dataSendMail: any) {
        let header: HttpHeaders = new HttpHeaders();
        header.append('Access-Control-Allow-Origin', '*');
        return this.http.post(`${environment.config.DOMAIN_URL}/sendMail`, {
            headers: header,
            params: dataSendMail,
        });
    }
    pay(dataMoney: any) {
        let header: HttpHeaders = new HttpHeaders();
        header.append('Access-Control-Allow-Origin', '*');
        return this.http.post(`${environment.config.DOMAIN_URL}/pay`, {
            headers: header,
            params: dataMoney,
        });
    }
    booking: number;
    empty: number;
    quantity: number;
    async setEmpty(idSchedule, quantity) {
        this.booking = 0;
        this.empty = 0;
        let schedule = Parse.Object.extend('schedule');
        let innerQuerySchedule = new Parse.Query(schedule);
        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);

        innerQuerySchedule.equalTo('objectId', idSchedule);
        query.matchesQuery('objSchedule', innerQuerySchedule);
        query.equalTo('status', true);
        let result = await query.find();
        if (result.length > 0) {
            result.map(rep => {
                this.booking += rep.attributes.numberAdult + rep.attributes.numberKids;
            });
        }
        this.empty = quantity - this.booking;
        return this.empty;
    }
    // ham xet gia khach hang
}
