import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class TourService {
    dataUpdate: Array<any> = [];
    infoTour: Array<any> = [];
    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log('tour Service');
    }
    async addTour(data) {
        let tour = Parse.Object.extend('tour');
        let obj = new tour();
        let dataSave: any = {};

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
        try {
            let result = await obj.save(dataSave);
            if (result) {
                let i = 0;
                while (data.location[i] || data.guide[i] || data.image[i]) {
                    let classInfo = Parse.Object.extend('infoTour');
                    let info = new classInfo();
                    let dataInfo: any = {};
                    dataInfo.objTour = tour.createWithoutData(result.id);

                    if (data.location[i] && data.guide[i] && data.image[i]) {
                        let classLocation = Parse.Object.extend('location');
                        let locationObject = classLocation.createWithoutData(data.location[i].id);
                        dataInfo.objLocation = locationObject;
                        let classGuide = Parse.Object.extend('guide');
                        let guideObject = classGuide.createWithoutData(data.guide[i].id);
                        dataInfo.objGuide = guideObject;
                        let name = data.image[i].name;
                        dataInfo.image = new Parse.File(name, data.image[i].file);
                        await info.save(dataInfo);
                        i++;
                    } else {
                        if (data.guide[i]) {
                            let classGuide = Parse.Object.extend('guide');
                            let guideObject = classGuide.createWithoutData(data.guide[i].id);
                            delete dataInfo.objLocation;
                            if (data.image[i]) {
                                dataInfo.objGuide = guideObject;
                                let name = data.image[i].name;
                                dataInfo.image = new Parse.File(name, data.image[i].file);
                                delete dataInfo.location;
                                await info.save(dataInfo);
                                i++;
                            } else {
                                delete dataInfo.location;
                                delete dataInfo.image;
                                dataInfo.objGuide = guideObject;
                                await info.save(dataInfo);
                                i++;
                            }
                        } else {
                            if (data.location[i]) {
                                let classLocation = Parse.Object.extend('location');
                                let locationObject = classLocation.createWithoutData(data.location[i].id);
                                if (data.image[i]) {
                                    delete dataInfo.objGuide;
                                    dataInfo.objLocation = locationObject;
                                    let name = data.image[i].name;
                                    dataInfo.image = new Parse.File(name, data.image[i].file);
                                    await info.save(dataInfo);
                                    i++;
                                } else {
                                    delete dataInfo.objGuide;
                                    delete dataInfo.image;
                                    dataInfo.objLocation = locationObject;
                                    await info.save(dataInfo);
                                    i++;
                                }
                            } else {
                                if (data.image[i]) {
                                    delete dataInfo.guide;
                                    delete dataInfo.location;
                                    let name = data.image[i].name;
                                    dataInfo.image = new Parse.File(name, data.image[i].file);
                                    await info.save(dataInfo);
                                    i++;
                                }
                            }
                        }
                    }
                }
            }
        } catch (ex) {}
    }

    async getTour() {
        const tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
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
            return result;
        } catch (ex) {}
    }
    task() {}
}
