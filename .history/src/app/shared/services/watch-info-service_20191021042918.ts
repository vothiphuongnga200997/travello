import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable()
export class WatchInfoService {
    constructor() {
        console.log('watch-info');
    }
    async getContrat(idUser) {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        // let currentUser = Parse.User.current();
        // let innerQuery = new Parse.Query(currentUser);

        let user = Parse.Object.extend('User');
        let innerQuery = new Parse.Query(user);
        innerQuery.equalTo('objectId', idUser);
        query.matchesQuery('objUser', innerQuery);

        query.include('objTour');
        query.include('objUser');
        try {
            let result = await query.find();
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}
