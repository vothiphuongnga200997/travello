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
        let dataInfo: any = {};
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
        console.log(data.image);

        try {
            let result = await obj.save(dataSave);
            dataInfo.objTour = tour.createWithoutData(result.id);
            let i = 0;
            if (result) {
                while (data.location[i] || data.guide[i]) {
                    let classInfo = Parse.Object.extend('infoTour');
                    let info = new classInfo();
                    if (data.location[i] && data.guide[i]) {
                        let classLocation = Parse.Object.extend('location');
                        let locationObject = classLocation.createWithoutData(data.location[i].id);
                        dataInfo.objLocation = locationObject;
                        let classGuide = Parse.Object.extend('guide');
                        let guideObject = classGuide.createWithoutData(data.guide[i].id);
                        dataInfo.objGuide = guideObject;
                        await info.save(dataInfo);
                        i++;
                    } else {
                        if (data.guide[i]) {
                            let classGuide = Parse.Object.extend('guide');
                            let guideObject = classGuide.createWithoutData(data.guide[i].id);
                            dataInfo.objGuide = guideObject;
                            delete dataInfo.objLocation;
                            await info.save(dataInfo);

                            i++;
                        } else {
                            let classLocation = Parse.Object.extend('location');
                            let locationObject = classLocation.createWithoutData(data.location[i].id);
                            dataInfo.objLocation = locationObject;
                            delete dataInfo.objGuide;
                            await info.save(dataInfo);
                            i++;
                        }
                    }
                }
                if (data.image > 0) {
                    try {
                        dataImg.idTour = tour.createWithoutData(result.id);
                        let objImg = new Parse.Object('imagesTour');
                        for (let x = 0; x < data.image.length; x++) {
                            let name = data.image[i].file.name;
                            dataImg.image = new Parse.File(name, data.image[i].file);
                            objImg.save(dataImg);
                        }
                    } catch (ex) {}
                }
            }
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
    get(idLoca, idGuide) {
        let classInfo = Parse.Object.extend('infoTour');
        let info = new classInfo();
        let classLocation = Parse.Object.extend('location');
        let locationObject = classLocation.createWithoutData(idLoca);
        info.set('objLocation', locationObject);
        idLoca.location.splice(0, 1);
        let classGuide = Parse.Object.extend('guide');
        let guideObject = classGuide.createWithoutData(idGuide);
        info.set('objGuide', guideObject);
        idGuide.location.splice(0, 1);
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
