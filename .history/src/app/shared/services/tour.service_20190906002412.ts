import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class TourService {
    dataUpdate: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log(tour Service);
    }
    async addGuide(
        nameTour: string,
        duration: string,
        departure: string,
        location: any,
        guide: any,
        startDay: any,
        endDay: any,
        quantity: number,
        hotel: string,
        childrenPrice: number,
        adultPrice: number,
    ) {
        let Location = Parse.Object.extend('tour');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.nameTour = nameTour;
        dataSave.duration = duration;
        dataSave.quantity = quantity;
        dataSave.departure = departure;
        dataSave.adultPrice = adultPrice;
        dataSave.childrenPrice = childrenPrice;
        dataSave.hotel = hotel;
        dataSave.endDay = endDay;
        dataSave.startDay = startDay;
        console.log(location);
        console.log(guide);
        // let classGuide = Parse.Object.extend('guide');
        // let objGuide = classGuide.createWithoutData('')
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
