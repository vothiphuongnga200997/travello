import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import * as moment from 'moment';

@Component({
    selector: 'ngx-filter-tour',
    templateUrl: './filter-tour.component.html',
    styleUrls: ['./filter-tour.component.scss'],
})
export class FilterTourComponent implements OnInit {
    // filter
    idSchedule: string;
    location: string = '';
    area: string = '';
    idGuide: string = '';
    startDay: any;
    endDay: any;
    departure: string = '';
    dataSchedule: Array<any>;
    status: string;
    constructor() {}
    ngOnInit() {
        this.filter();
    }
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async filter() {
        this.dataSchedule = [];
        let result: any;
        let schedule = Parse.Object.extend('schedule');
        let query = new Parse.Query(schedule);

        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);
        if (this.idGuide !== '') {
            const guide = Parse.Object.extend('guide');
            const queryGuide = new Parse.Query(guide);
            queryGuide.equalTo('objectId', this.idGuide);
            let objGuide = await queryGuide.first();
            query.equalTo('objGuide', objGuide);
        }
        if (this.startDay !== null && this.startDay !== undefined) {
            query.greaterThan('startDay', this.startDay);
        }
        // if (this.endDay !== null && this.endDay !== undefined) {
        //     query.lessThan('startDay', this.startDay);
        // }
        if (this.location !== null && this.location !== '') {
            const location = Parse.Object.extend('location');
            const queryLocation = new Parse.Query(location);
            queryLocation.equalTo('location', this.capital_letter(this.location));
            let i = await queryLocation.first();
            if (i) {
                innerQueryTour.equalTo('locations', i);
                let resultT = await innerQueryTour.find();
                console.log(resultT);
                query.matchesQuery('objTour', innerQueryTour);
            }
        }
        // if (this.idSchedule !== null && this.idSchedule !== '') {
        //     query.equalTo('objectId', this.idSchedule);
        // }
        // if (this.status !== null && this.status !== '') {
        // }
        // if (this.area !== null && this.area !== '') {
        //     const location = Parse.Object.extend('location');
        //     const queryLocation = new Parse.Query(location);
        //     queryLocation.equalTo('area', this.area);
        //     let i = await queryLocation.find();
        //     if (i) {
        //         innerQueryTour.containedIn('locations', i);
        //         query.matchesQuery('objTour', innerQueryTour);
        //     }
        // }
        result = await query.find();
        if (result.length) {
            for (let data of result) {
                this.dataSchedule.push({
                    startDay: moment(data.get('startDay')).format('DD/MM/YYYY, h:mm A'),
                    endDay: moment(data.get('endDay')).format('DD/MM/YYYY, h:mm A'),
                    codeSchedule: data.get('codeSchedule'),
                    nameTour: data.attributes.objTour.attributes.nameTour,
                    itinerary: data.attributes.objTour.attributes.itinerary,
                });
            }
        }
    }
}
