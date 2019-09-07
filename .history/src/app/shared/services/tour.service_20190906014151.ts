import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class TourService {
    dataUpdate: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log('tour Service');
    }
    async addGuide(data) {
        let tour = Parse.Object.extend('tour');
        let obj = new tour();
        let dataSave: any = {};
        console.log(data.guide);
        // dataSave.nameTour = data.nameTour;
        // dataSave.duration = data.duration;
        // dataSave.quantity = data.quantity;
        // dataSave.departure = data.departure;
        // dataSave.adultPrice = data.adultPrice;
        // dataSave.childrenPrice = data.childrenPrice;
        // dataSave.hotel = data.hotel;
        // dataSave.endDay = data.endDay;
        // dataSave.startDay = data.startDay;
        // dataSave.location = data.location;
        // dataSave.guide = data.guide;
        try {
            for (let i = 0; i < data.location.length; i++) {
                const id = data.guide[i].id;
                let classInfo = Parse.Object.extend('locationInfo');
                let location = new classInfo();
                // let classLocation = Parse.Object.extend('location');

                let myObject = Parse.location.createWithoutData(id);
                console.log(myObject);
                location.set('idLocation', myObject);
            }
        } catch (ex) {}

        // try {
        //     let result = await obj.save(dataSave);
        //     return result;
        // } catch (ex) {}
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
    task() {}
}
