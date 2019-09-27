import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TourService {
    dataUpdate: Array<any> = [];
    infoTour: Array<any> = [];

    data: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {
        console.log('tour Service');
    }
    async addTour(data) {
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        let objTour = new tour();
        let dataSave: any = {};
        let dataImg: any = {};
        let guide: Array<any> = [];
        let location: Array<any> = [];
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
        dataSave.code = data.code;
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
        console.log(data.location);
        console.log(location);
        try {
            let result = await objTour.save(dataSave);
            let guideRelation = result.relation('guide');
            let locationRelation = result.relation('locations');
            guideRelation.add(guide);
            locationRelation.add(location);
            result.save();
            let tourObject = tour.createWithoutData(result.id);
            dataImg.idTour = tourObject;
            for (let i = 0; i < data.image.length; i++) {
                let objImg = new image();
                let name = data.image[i].name;
                dataImg.image = new Parse.File(name, data.image[i].file);
                dataImg.nameFile = name;
                await objImg.save(dataImg);
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
        dataSave.code = data.code;
        dataSave.objectId = data.id;
        if (data)
            if (data.guide) {
                for (let i = 0; i < data.guide.length; i++) {
                    let classGuide = await Parse.Object.extend('guide');
                    guide[i] = await classGuide.createWithoutData(data.guide[i].id);
                }
            }
        console.log(data.location);

        for (let i = 0; i < data.location.length; i++) {
            let classLocation = await Parse.Object.extend('location');
            location[i] = await classLocation.createWithoutData(data.location[i].id);
        }
        console.log(location);
        try {
            let result = await objTour.save(dataSave);
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
                    dataImg.image = new Parse.File(data.image[i].name, data.image[i].file);
                    dataImg.nameFile = data.image[i].name;
                    await objImg.save(dataImg);
                } else {
                    let objImg = new image();
                    dataImg.image = data.image[i].file;
                    dataImg.nameFile = data.image[i].name;
                    await objImg.save(dataImg);
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
    async deleteLocation(idTour, objTour) {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', idTour);
        let result = await query.first();

        let relation = await result.relation('locations');
        await relation.remove(objTour);
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
        await obj.destroy();
        await this.deleteImg(obj);
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
        let result = await query.find();
        return result;
    }
}
