import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class LocationService {
    dataUpdate: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {}
    async addLocation(location: string, area: string) {
        let Location = Parse.Object.extend('location');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.location = location;
        dataSave.area = area;
        try {
            let result = await obj.save(dataSave);
            await Parse.Object.saveAll(this.dataUpdate);
            return result;
        } catch (ex) {}
    }
    async getListLocations() {
        const Location = Parse.Object.extend('location');
        const queryLocation = new Parse.Query(Location);
        try {
            let result = await queryLocation.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
    async edit(id: string, location: string, area: string) {
        let Location = Parse.Object.extend('location');
        let obj = new Location();
        let dataSave: any = {};
        dataSave.location = location;
        dataSave.area = area;
        if (id) {
            dataSave.objectId = id;
            let result = await obj.save(dataSave);
            return result;
        }
    }
}
