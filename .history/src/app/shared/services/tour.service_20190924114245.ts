import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { combineAll } from 'rxjs/operators';

@Injectable()
export class TourService {
    dataUpdate: Array<any> = [];
    infoTour: Array<any> = [];
    guide: Array<any> = [];
    location: Array<any> = [];
    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log('tour Service');
    }
    async addTour(data) {
        let tour = Parse.Object.extend('tour');
        let obj = new tour();
        let dataSave: any = {};
        let dataInfo: any = {};
        dataSave.nameTour = data.nameTour;
        dataSave.duration = data.duration;
        dataSave.quantity = data.quantity;
        dataSave.departure = data.departure;
        dataSave.adultPrice = data.adultPrice;
        dataSave.childrenPrice = data.childrenPrice;
        dataSave.hotel = data.hotel;
        dataSave.endDay = data.endDay;
        dataSave.startDay = data.startDay;
        dataSave.itinerary = data.itinerary;
        dataSave.idTour = data.idTour;
        let classGuide = Parse.Object.extend('guide');
        console.log(data);
        if (data.guide) {
            for (let i = 0; i < data.guide.length; i++) {
                let guideObject = classGuide.createWithoutData(data.guide[i].id);
                this.guide[i] = guideObject;
            }
        }
        if (data.location.length > 0) {
            for (let i = 0; i < data.location.length; i++) {
                let classLocation = Parse.Object.extend('location');
                this.location[i] = classLocation.createWithoutData(data.location[i].id);
            }
        }
        try {
            let result = await obj.save(dataSave);
            let guideRelation = result.relation('guide');
            let locationRelation = result.relation('locations');
            guideRelation.add(this.guide);
            locationRelation.add(this.location);
            result.save();
            if (data.image.length) {
                for (let i = 0; i < data.image.length; i++) {
                    let name = data.image[i].name;
                    dataInfo.image = new Parse.File(name, data.image[i].file);
                    await info.save(dataInfo);
                }
            }
        } catch (ex) {}
    }

    async getTour() {
        // let user = Parse.User.current();
        // console.log('user', user);
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        let result = await query.find();
        // console.log(result);
        // let relation = result[0].relation('guide');
        // let i = relation.query().find();
        return result;

        // console.log(query);
        // let relation = query.relation('guide');
        // console.log(relation);
        // let i = relation.query().find();
        // console.log(i);
        // const tour = Parse.Object.extend('tour');
        // const query = new Parse.Query(tour);
        // let relation = tour.relation('guide');
        // query.include('guide');
        // relation.query().find({
        //     success: function(list) {
        //         console.log(list);
        //     },
        // });
        // try {
        //     let result = await query.find();
        //     console.log(result);
        //     return result;
        // } catch (ex) {
        //     throw ex;
        // }
    }
    async getInfo(res) {
        const tour = Parse.Object.extend('infoTour');
        const query = new Parse.Query(tour);
        query.equalTo('objTour', res);
        try {
            let result = await query.find();
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].attributes.objLocation) {
                        this.infoTour.unshift({
                            objectIdLocation: result[i].attributes.objLocation.id,
                            location: result[i].attributes.objLocation.attributes.location,
                        });
                    }
                    if (result[i].attributes.objGuide) {
                        this.infoTour.unshift({
                            objectIdGuide: result[i].attributes.objGuide.id,
                            fullName: result[i].attributes.objGuide.attributes.fullName,
                        });
                    }
                    if (result[i].attributes.image) {
                        this.infoTour.unshift({ image: result[i].attributes.image });
                    }
                }
                return this.infoTour;
            }
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
    async findTour(id) {
        const tour = Parse.Object.extend('infoTour');
        const query = new Parse.Query(tour);
        query.equalTo('objGuide', id);
        try {
            let result = await query.find();
            console.log(result);
            return result;
        } catch (ex) {}
    }
    task() {}
}
