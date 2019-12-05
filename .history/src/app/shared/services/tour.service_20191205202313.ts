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
        dataTour.status = true;
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
                        dataSchedule.hotel = data.schedule.value.listSchedule[i].hotel;
                        dataSchedule.status = true;
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
    async editSchedule(idSchedule, listGuide, listGuideOld, objTour) {
        let succes = '';
        let schedule = Parse.Object.extend('schedule');
        let guide: Array<any> = [];
        let objGuide: Array<any> = [];
        if (listGuide.length > 0) {
            for (let i = 0; i < listGuide.length; i++) {
                guide = [];
                for (let n = 0; n < listGuide[i].length; n++) {
                    let classGuide = Parse.Object.extend('guide');
                    guide[n] = classGuide.createWithoutData(listGuide[i][n].id);
                }
                objGuide[i] = guide;
            }
        }

        for (let i = 0; i < idSchedule.listSchedule.length; i++) {
            if (idSchedule.listSchedule[i].id !== '') {
                let objSchedule = new schedule();
                let dataSchedule: any = {};
                dataSchedule.id = idSchedule.listSchedule[i].id;
                dataSchedule.startDay = new Date(idSchedule.listSchedule[i].startDay);
                dataSchedule.endDay = new Date(idSchedule.listSchedule[i].endDay);
                dataSchedule.hotel = idSchedule.listSchedule[i].hotel;
                dataSchedule.codeSchedule =
                    objTour.get('code').toUpperCase() + '-' + moment(idSchedule.listSchedule[i].startDay).format('DDMMYYYY');
                let saveSchedule = await objSchedule.save(dataSchedule);
                let deleteGuide = await this.deleteGuide(saveSchedule.id, listGuideOld[i]);
                if (deleteGuide) {
                    let guideRelation = saveSchedule.relation('objGuide');
                    guideRelation.add(objGuide[i]);
                    succes = saveSchedule.save();
                }
            } else {
                let objSchedule = new schedule();
                let dataSchedule: any = {};
                dataSchedule.startDay = new Date(idSchedule.listSchedule[i].startDay);
                dataSchedule.endDay = new Date(idSchedule.listSchedule[i].endDay);
                dataSchedule.objTour = objTour;
                dataSchedule.status = true;
                dataSchedule.hotel = idSchedule.listSchedule[i].hotel;
                dataSchedule.codeSchedule =
                    objTour.get('code').toUpperCase() + '-' + moment(idSchedule.listSchedule[i].startDay).format('DDMMYYYY');
                dataSchedule.empty = objTour.get('quantity');
                let saveSchedule = await objSchedule.save(dataSchedule);
                let guideRelation = saveSchedule.relation('objGuide');
                guideRelation.add(objGuide[i]);
                succes = await saveSchedule.save();
            }
        }
        if (succes !== '') return succes;
    }
    async editTour(form, listlocation, listlocationOld, image) {
        let location: Array<any> = [];
        let tour = Parse.Object.extend('tour');
        let objTour = new tour();
        let dataSave: any = {};
        let dataImg: any = {};
        dataSave.departure = this.capital_letter(form.departure);
        dataSave.nameTour = form.nameTour.toUpperCase();
        dataSave.duration = form.duration;
        dataSave.quantity = form.quantity;
        dataSave.adultPrice = form.adultPrice;
        dataSave.childrenPrice = form.childrenPrice;
        dataSave.itinerary = form.itinerary;
        dataSave.code = form.code.toUpperCase();
        dataSave.specical = form.specical;
        dataSave.saleoff = form.saleoff;
        dataSave.vehicle = form.vehicle;
        dataSave.surcharge = form.contacts;
        dataSave.objectId = form.id;
        dataSave.note = form.note;
        dataSave.policy = form.policy;
        dataSave.highlights = form.highlights;

        for (let i = 0; i < listlocation.length; i++) {
            let classLocation = await Parse.Object.extend('location');
            location[i] = await classLocation.createWithoutData(listlocation[i].id);
        }
        try {
            let result = await objTour.save(dataSave);
            if (result) {
                for (let l of listlocationOld) await this.deleteLocation(result.id, l);
                let locationRelation = result.relation('locations');
                locationRelation.add(location);
                result.save();
                let objImage = Parse.Object.extend('imagesTour');
                let tourObject = tour.createWithoutData(result.id);
                dataImg.idTour = tourObject;
                await this.deleteImg(result);

                for (let i = 0; i < image.length; i++) {
                    if (image[i].file.size) {
                        let objImg = new objImage();
                        dataImg.image = new Parse.File('travello', image[i].file);
                        dataImg.nameFile = image[i].name;
                        await objImg.save(dataImg);
                    } else {
                        let objImg = new objImage();
                        dataImg.image = image[i].file;
                        dataImg.nameFile = image[i].name;
                        await objImg.save(dataImg);
                    }
                }
            }
            return result;
        } catch (ex) {}
    }
    async deleteGuide(id, objGuide) {
        let schedule = Parse.Object.extend('schedule');
        const query = new Parse.Query(schedule);
        query.equalTo('objectId', id);
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
        let success = '';
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(image);
        query.equalTo('idTour', objTour);
        let resultImg = await query.find();
        for (let list of resultImg) {
            success = await list.destroy();
        }
        if (success !== '') return success;
    }
    async deleteTour(obj, scheduleDelete) {
        try {
            let contract = Parse.Object.extend('contract');
            const query = new Parse.Query(contract);
            let repay = Parse.Object.extend('repay');
            query.containedIn('objSchedule', scheduleDelete);
            query.equalTo('status', true);
            let result = await query.find();
            console.log(result);
            for (let data of result) {
                let ObjectSchedule = new repay();
                let ObjectContract = new contract();

                let dataReapy: any = {};
                let dataContract: any = {};
                if (data.get('paid') > 0) {
                    dataReapy.repay = data.get('paid');
                    dataReapy.paid = 0;
                    dataReapy.objContract = data;
                    dataReapy.status = true;
                    await ObjectSchedule.save(dataReapy);
                    let customer = Parse.Object.extend('customer');
                    const queryCustomer = new Parse.Query(customer);
                    let resultCustomer = queryCustomer.first();
                    if (resultCustomer) {
                        const objCustomer = new customer();
                        let dataCustomer: any = {};
                        dataCustomer.objectId = resultCustomer.id;
                        dataCustomer.paid = resultCustomer.paid - data.get('price') - data.get('price') * data.get('discount');
                        dataCustomer.discount = 0;
                        if (dataCustomer >= 100000000) dataCustomer.discount = 0.1;
                        if (dataCustomer < 100000000 && dataCustomer >= 50000000) dataCustomer.discount = 0.05;
                        await objCustomer.save(dataCustomer);
                    }
                }
                dataContract.status = false;
                dataContract.objectId = data.id;
                await ObjectContract.save(dataContract);
            }
            let i = await obj.destroy();
            await scheduleDelete.destroy();
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
    async queryTour(idTour) {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', idTour);
        let result = await query.first();
        return result;
    }
    async querySchedule(objSchedule) {
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);
        querySchedule.equalTo('objectId', objSchedule);
        querySchedule.include('objTour');
        let resultShedule = await querySchedule.first();
        return resultShedule;
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
    async getContractSchedule(objSchedule) {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.equalTo('objSchedule', objSchedule);
        query.notEqualTo('infoCustom', []);
        query.select('date', 'infoCustom', 'numberAdult', 'numberKids', 'objUser');
        query.include('objUser');
        query.equalTo('status', true);
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
