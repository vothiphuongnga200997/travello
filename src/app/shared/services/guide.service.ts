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
        dataSave.phone = phone;
        dataSave.address = address;
        dataSave.birthday = birthday;
        dataSave.status = true;
        try {
            let result = await obj.save(dataSave);
            return result;
        } catch (ex) {}
    }
    async getListGuides() {
        const Guide = Parse.Object.extend('guide');
        const query = new Parse.Query(Guide);
        query.equalTo('status', true);
        try {
            let result = await query.find();
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
        dataSave.phone = phone;
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
        const obj = new Guide();
        let dataSave: any = {};
        dataSave.objectId = id;
        dataSave.status = false;
        try {
            let result = await obj.save(dataSave);
            return result;
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
        query.equalTo('objGuide', objid);
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
        query.equalTo('objGuide', id);
        query.include('objGuide');
        query.include('objTour');

        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async findTour(startDay, endDay) {
        let listGuide: Array<any> = [];
        const currentDate = new Date();
        const Schedule = Parse.Object.extend('schedule');
        const queryTour = new Parse.Query(Schedule);
        queryTour.greaterThan('endDay', currentDate);

        let tour = await queryTour.find();

        if (tour.length > 0) {
            for (let i of tour) {
                let start = moment(i.get('startDay')).format('YYYY-MM-DD');
                let end = moment(i.get('endDay')).format('YYYY-MM-DD');
                let goStart = moment(startDay).format('YYYY-MM-DD');
                let goEnd = moment(endDay).format('YYYY-MM-DD');
                if (end >= goStart && start <= goEnd) {
                    let guideRelation = i.relation('objGuide');
                    let guide = await guideRelation.query().find();
                    for (let n = 0; n < guide.length; n++) {
                        listGuide[n] = guide[n].id;
                    }
                }
            }
            const Guide = Parse.Object.extend('guide');
            const queryGuide = new Parse.Query(Guide);
            queryGuide.notContainedIn('objectId', listGuide);
            queryGuide.equalTo('status', true);
            let result = await queryGuide.find();
            return result;
        }
    }
}
