import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { ConsoleLogService } from './console-log.service';
import { COSMIC_THEME } from '../../@theme/styles/theme.cosmic';

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
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        let objTour = new tour();
        let dataSave: any = {};
        let dataImg: any = {};
        let guide: Array<any> = [];
        let location: Array<any> = [];
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
        dataSave.surcharge = data.value.contacts;
        if (data)
            if (data.guide) {
                for (let i = 0; i < data.guide.length; i++) {
                    let classGuide = Parse.Object.extend('guide');
                    guide[i] = classGuide.createWithoutData(data.guide[i].id);
                }
            }
        for (let i = 0; i < data.location.length; i++) {
            let classLocation = Parse.Object.extend('location');
            location[i] = classLocation.createWithoutData(data.location[i].id);
        }
        try {
            let result = await objTour.save(dataSave);
            if (result) {
                this.deleteImg(result);

                let guideRelation = result.relation('guide');
                let locationRelation = result.relation('locations');
                guideRelation.add(guide);
                locationRelation.add(location);
                result.save();
                let tourObject = tour.createWithoutData(result.id);
                dataImg.idTour = tourObject;
                for (let i = 0; i < data.image.length; i++) {
                    let objImg = new image();
                    let name = 'travello';
                    dataImg.image = new Parse.File(name, data.image[i].file);
                    dataImg.nameFile = name;
                    await objImg.save(dataImg);
                }
            }
        } catch (ex) {}
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
        dataSave.empty = this.setEmpty(data.id);
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
            console.log(result);
            if (result) {
                this.deleteImg(result);
                for (let g of data.guideFirst) await this.deleteGuide(result, g);
                for (let l of data.locationFirst) await this.deleteLocation(result, l);

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
    async deleteGuide(idTour, objGuide) {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', idTour);
        let result = await query.first();

        let relation = await result.relation('guide');
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
    async getGuide(obj) {
        let guideRelation = obj.relation('guide');
        let guide = guideRelation.query().find();
        return guide;
    }
    async getLocation(obj) {
        let locationRelation = obj.relation('locations');
        let location = locationRelation.query().find();
        return location;
    }
    async getImage(obj) {
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(image);
        query.equalTo('idTour', obj);
        let result = await query.find();
        return result;
    }
    async getTour() {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.include('guide');
        query.descending('createdAt');
        let result = await query.find();
        return result;
    }
    booking: number = 0;
    empty: number = 0;
    quantity: number = 0;
    async setEmpty(idTour) {
        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);
        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);

        innerQueryTour.equalTo('objectId', idTour);
        query.matchesQuery('objTour', innerQueryTour);
        let result = await query.find();
        result.map(rep => {
            console.log(rep);
            this.booking += rep.attributes.numberAdult + rep.attributes.numberKids;
            this.quantity = rep.attributes.objTour.attributes.quantity;
        });
        this.empty = this.quantity - this.booking;
        return this.empty;
    }
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
