import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class GuideService {
    dataUpdate: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log('guide Server');
    }
    async addGuide(fullName: string, email: string, address: string, phone: any, birthday: any) {
        let Location = Parse.Object.extend('guide');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.fullName = fullName;
        dataSave.email = email;
        dataSave.phone = parseFloat(phone.toString());
        dataSave.address = address;
        dataSave.birthday = birthday;
        try {
            let result = await obj.save(dataSave);
            return result;
        } catch (ex) {}
    }
    async getListGuides() {
        const Guide = Parse.Object.extend('guide');
        const queryLocation = new Parse.Query(Guide);
        try {
            let result = await queryLocation.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async editGuide(id: string, fullName: string, email: string, address: string, phone: any, birthday: any) {
        let Location = Parse.Object.extend('guide');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.fullName = fullName;
        dataSave.email = email;
        dataSave.phone = parseFloat(phone.toString());
        dataSave.address = address;
        dataSave.birthday = birthday;
        if (id) {
            dataSave.objectId = id;
            let result = await obj.save(dataSave);
            return result;
        }
    }
    async delete(id) {
        const Guide = Parse.Object.extend('guide');

        const query = new Parse.Query(Guide);
        query.equalTo('objectId', id);
        let result = await query.find();
        try {
            await result[0].destroy();
            return true;
        } catch (ex) {
            throw ex;
        }
    }
    async getTour(objid) {
        const currentDate = new Date();
        const tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.ascending('startDay');
        query.greaterThan('endDay', currentDate);
        query.equalTo('guide', objid);
        query.include('guide');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async getTourEnd(id) {
        const currentDate = new Date();
        const tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.ascending('startDay');
        query.lessThan('endDay', currentDate);
        query.equalTo('guide', id);
        query.include('guide');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async findTour(startDay, endDay) {
        let listGuide: Array<any> = [];
        console.log(startDay);
        console.log(endDay);
        const Tour = Parse.Object.extend('tour');
        const queryTour = new Parse.Query(Tour);
        let tour = await queryTour.find();
        console.log(tour);

        if (tour.length > 0) {
            for (let i of tour) {
                let start = moment(i.get('startDay')).format('YYYY-MM-DD');
                let end = moment(i.get('endDay')).format('YYYY-MM-DD');
                let goStart = moment(startDay).format('YYYY-MM-DD');
                let goEnd = moment(endDay).format('YYYY-MM-DD');
                if (end >= goStart && go <= goEnd) console.log(i);
            }
        }
        // let guide = await queryGuide.find();
        // return guide;

        // const currentDate = new Date();
        // const tour = Parse.Object.extend('tour');
        // const query = new Parse.Query(tour);
        // query.ascending('startDay');
        // query.greaterThan('endDay', currentDate);
        // query.equalTo('guide', guide);
        // query.include('guide');
        // try {
        //     let result = await query.find();
        //     return result;
        // } catch (ex) {
        //     throw ex;
        // }
        // const currentDate = new Date();
        // const tour = Parse.Object.extend('tour');
        // const query = new Parse.Query(tour);
        // query.lessThan('endDay', currentDate);
        // query.equalTo('guide', guide);
        // query.include('guide');
        // try {
        //     let result = await query.find();
        //     return result;
        // } catch (ex) {
        //     throw ex;
        // }
    }
}
