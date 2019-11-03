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
    async addGuide(fullname: string, email: string, address: string, phone: any, birthday: any) {
        let Location = Parse.Object.extend('guide');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.fullname = fullname;
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
    async editGuide(id: string, fullname: string, email: string, address: string, phone: any, birthday: any) {
        let Location = Parse.Object.extend('guide');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.fullname = fullname;
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
        const schedule = Parse.Object.extend('schedule');
        const query = new Parse.Query(schedule);
        query.ascending('startDay');
        query.greaterThan('endDay', currentDate);
        query.equalTo('guide', objid);
        query.include('objGuide');
        query.include('objTour');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async getTourEnd(id) {
        const currentDate = new Date();
        const schedule = Parse.Object.extend('schedule');
        const query = new Parse.Query(schedule);
        query.ascending('startDay');
        query.lessThan('endDay', currentDate);
        query.equalTo('guide', id);
        query.include('objGuide');
        query.include('objTour');

        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async findTour(startDay, endDay, list?) {
        let listGuide: Array<any> = [];
        const currentDate = new Date();
        const Tour = Parse.Object.extend('tour');
        const queryTour = new Parse.Query(Tour);
        queryTour.greaterThan('endDay', currentDate);

        let tour = await queryTour.find();

        if (tour.length > 0) {
            for (let i of tour) {
                let start = moment(i.get('startDay')).format('YYYY-MM-DD');
                let end = moment(i.get('endDay')).format('YYYY-MM-DD');
                let goStart = moment(startDay).format('YYYY-MM-DD');
                let goEnd = moment(endDay).format('YYYY-MM-DD');
                if (end >= goStart && start <= goEnd) {
                    let guideRelation = i.relation('guide');
                    let guide = await guideRelation.query().find();
                    for (let n = 0; n < guide.length; n++) {
                        listGuide[n] = guide[n].id;
                    }
                }
            }
            const Guide = Parse.Object.extend('guide');
            const queryGuide = new Parse.Query(Guide);
            queryGuide.notContainedIn('objectId', listGuide);
            let result = await queryGuide.find();
            return result;
        }
    }
}
