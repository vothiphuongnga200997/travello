import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class TourService {
    dataUpdate: Array<any> = [];
    infoTour: Array<any> = [];

    data: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log('tour Service');
    }
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async addTour(data) {
        console.log(data);
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        let objTour = new tour();
        let dataTour: any = {};
        let dataImg: any = {};
        let guide: Array<any> = []; // chua tung gia tri class guide
        let objGuide: Array<any> = []; // chua objGuide
        let location: Array<any> = [];
        dataTour.departure = this.capital_letter(data.value.departure);
        dataTour.nameTour = data.value.nameTour.toUpperCase();
        dataTour.duration = data.value.duration;
        dataTour.quantity = data.value.quantity;
        dataTour.adultPrice = data.value.adultPrice;
        dataTour.childrenPrice = data.value.childrenPrice;
        dataTour.itinerary = data.value.itinerary;
        dataTour.code = data.value.code.toUpperCase();
        dataTour.specical = data.value.specical;
        dataTour.saleoff = data.value.saleoff;
        dataTour.note = data.value.note;
        dataTour.highlights = data.value.highlights;
        dataTour.surcharge = data.value.contacts;
        dataTour.policy = data.value.policy;
        dataTour.empty = data.value.quantity;
        dataTour.vehicle = data.value.vehicle;
        if (data.listGuide.length > 0) {
            for (let i = 0; i < data.listGuide.length; i++) {
                guide = [];
                for (let n = 0; n < data.listGuide[i].length; n++) {
                    let classGuide = Parse.Object.extend('guide');
                    guide[n] = classGuide.createWithoutData(data.listGuide[i][n].id);
                }
                objGuide[i] = guide;
            }
        }
        if (data.location.length > 0) {
            for (let i = 0; i < data.location.length; i++) {
                let classLocation = Parse.Object.extend('location');
                location[i] = classLocation.createWithoutData(data.location[i].id);
            }
        }
        try {
            let result = await objTour.save(dataTour);
            if (result) {
                try {
                    let tourObject = tour.createWithoutData(result.id);
                    let schedule = Parse.Object.extend('schedule');
                    let locationRelation = result.relation('locations');
                    locationRelation.add(location);
                    result.save();
                    dataImg.idTour = tourObject;
                    for (let i = 0; i < data.image.length; i++) {
                        let objImg = new image();
                        let name = 'travello';
                        dataImg.image = new Parse.File(name, data.image[i].file);
                        dataImg.nameFile = name;
                        await objImg.save(dataImg);
                    }
                    for (let i = 0; i < data.schedule.value.listSchedule.length; i++) {
                        let objSchedule = new schedule();
                        let dataSchedule: any = {};
                        dataSchedule.startDay = new Date(data.schedule.value.listSchedule[i].startDay);
                        dataSchedule.endDay = new Date(data.schedule.value.listSchedule[i].endDay);
                        dataSchedule.codeSchedule =
                            data.value.code.toUpperCase() + '-' + moment(data.schedule.value.listSchedule[i].startDay).format('DDMMYYYY');
                        dataSchedule.objTour = tourObject;
                        dataSchedule.empty = data.value.quantity;
                        let saveSchedule = await objSchedule.save(dataSchedule);
                        let guideRelation = saveSchedule.relation('objGuide');
                        guideRelation.add(objGuide[i]);
                        saveSchedule.save();
                    }
                } catch (ex) {
                    throw ex;
                }
            }
        } catch (ex) {
            throw ex;
        }
    }
    async editSchedule(idSchedule, listGuide, listGuideOld) {
        console.log(idSchedule);
        console.log(listGuide);
        console.log(listGuideOld);
        let dataSave: any = {};

        // for (let i = 0; i < idSchedule.listSchedule.length; i++) {
        //     dataSave.id = idSchedule.listSchedule[0];
        //     dataSave.startDay = new Date(idSchedule.listSchedule[i].startDay);
        //     dataSave.endDay = new Date(idSchedule.listSchedule[i].endDay);
        //     dataSave.hotel = idSchedule.listSchedule[i].hotel;
        //     for (let objGuide of listGuideOld) {
        //         await this.deleteGuide(idSchedule.listSchedule[0].id, objGuide);
        //     }
        // }
        // await this.deleteGuide(idSchedule.listSchedule[0].id, listGuideOld[0][0]);
    }
    async editTour(data) {
        let guide: Array<any> = [];
        let location: Array<any> = [];

        let tour = Parse.Object.extend('tour');

        let objTour = new tour();
        let dataSave: any = {};
        let dataImg: any = {};
        dataSave.departure = this.capital_letter(data.value.departure);
        dataSave.nameTour = data.value.nameTour.toUpperCase();
        dataSave.duration = data.value.duration;
        dataSave.quantity = data.value.quantity;
        dataSave.adultPrice = data.value.adultPrice;
        dataSave.childrenPrice = data.value.childrenPrice;
        dataSave.hotel = data.value.hotel;
        dataSave.endDay = new Date(data.value.endDay);
        dataSave.startDay = new Date(data.value.startDay);
        dataSave.itinerary = data.value.itinerary;
        dataSave.code = data.value.code.toUpperCase();
        dataSave.specical = data.value.specical;
        dataSave.saleoff = data.value.saleoff;
        dataSave.vehicle = data.value.vehicle;
        dataSave.surcharge = data.value.contacts;
        dataSave.objectId = data.id;
        dataSave.note = data.value.note;
        dataSave.policy = data.value.policy;
        dataSave.highlights = data.value.highlights;

        if (data.guide) {
            for (let i = 0; i < data.guide.length; i++) {
                let classGuide = await Parse.Object.extend('guide');
                guide[i] = await classGuide.createWithoutData(data.guide[i].id);
            }
        }

        for (let i = 0; i < data.location.length; i++) {
            let classLocation = await Parse.Object.extend('location');
            location[i] = await classLocation.createWithoutData(data.location[i].id);
        }
        try {
            let result = await objTour.save(dataSave);
            if (result) {
                console.log(data);
                await this.deleteImg(result);
                for (let g of data.guideFirst) await this.deleteGuide(result.id, g);
                for (let l of data.locationFirst) await this.deleteLocation(result.id, l);

                let guideRelation = result.relation('guide');
                let locationRelation = result.relation('locations');
                guideRelation.add(guide);
                locationRelation.add(location);
                result.save();
                let image = Parse.Object.extend('imagesTour');
                let tourObject = tour.createWithoutData(result.id);
                dataImg.idTour = tourObject;
                for (let i = 0; i < data.image.length; i++) {
                    if (data.image[i].file.size) {
                        let objImg = new image();
                        dataImg.image = new Parse.File('travello', data.image[i].file);
                        dataImg.nameFile = data.image[i].name;
                        await objImg.save(dataImg);
                    } else {
                        let objImg = new image();
                        dataImg.image = data.image[i].file;
                        dataImg.nameFile = data.image[i].name;
                        await objImg.save(dataImg);
                    }
                }
            }
        } catch (ex) {}
    }
    async deleteGuide(id, objGuide) {
        let schedule = Parse.Object.extend('schedule');
        const query = new Parse.Query(schedule);
        query.equalTo('objectId', id.id);
        let result = await query.first();
        let relation = await result.relation('objGuide');
        relation.remove(objGuide);
        result.save();
        return result;
    }
    async deleteLocation(idTour, objLocation) {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', idTour);
        let result = await query.first();

        let relation = await result.relation('locations');
        await relation.remove(objLocation);
        await result.save();
        return result;
    }
    async deleteImg(objTour) {
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(image);
        query.equalTo('idTour', objTour);
        let resultImg = await query.find();
        for (let list of resultImg) {
            await list.destroy();
        }
    }
    async deleteTour(obj) {
        try {
            let i = await obj.destroy();
            await this.deleteImg(obj);
            return i;
        } catch (ex) {
            throw ex;
        }
    }
    async getGuide(objSchedule) {
        let guideRelation = objSchedule.relation('objGuide');
        let guide = guideRelation.query().find();
        return guide;
    }
    async getLocation(objTour) {
        let locationRelation = objTour.relation('locations');
        let location = locationRelation.query().find();
        return location;
    }
    async getImage(objTour) {
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(image);
        query.equalTo('idTour', objTour);
        let result = await query.find();
        return result;
    }
    async getTour() {
        let data: Array<any> = [];
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        const currentDate = new Date();
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);
        query.descending('createdAt');
        let result = await query.find();
        if (result) {
            for (let i of result) {
                querySchedule.equalTo('objTour', i);
                querySchedule.descending('startDay');
                querySchedule.select('startDay', 'endDay');
                let resultShedule = await querySchedule.find();
                data.push({
                    info: i,
                    schedule: resultShedule,
                });
            }
        }
        return data;
    }
    async schedule(obj) {
        try {
            let schedule = Parse.Object.extend('schedule');
            const querySchedule = new Parse.Query(schedule);
            querySchedule.equalTo('objTour', obj);
            querySchedule.descending('startDay');
            let resultShedule = await querySchedule.find();
            return resultShedule;
        } catch (ex) {}
    }
    async queryTour(idTour) {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', idTour);
        let result = await query.first();
        return result;
    }
    booking: number;
    empty: number;
    quantity: number;

    async checkCode(code) {
        const Tour = Parse.Object.extend('tour');
        const query = new Parse.Query(Tour);
        query.select('code');
        query.equalTo('code', code);
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
