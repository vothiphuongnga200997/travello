import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-filter-tour',
    templateUrl: './filter-tour.component.html',
    styleUrls: ['./filter-tour.component.scss'],
})
export class FilterTourComponent implements OnInit {
    // filter
    location: string = '';
    area: string = '';
    idGuide: string = '';
    startDay: any;
    endDay: any;
    departure: string = '';
    objSchedule: any;
    dataSchedule: Array<any>;
    constructor() {}
    ngOnInit() {
        if (this.objSchedule !== null && this.objSchedule !== undefined) {
            this.filter();
        }
    }
    async filter() {
        this.dataSchedule = [];
        let result: any;
        let schedule = Parse.Object.extend('schedule');
        let query = new Parse.Query(schedule);
        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);
        // if (this.idGuide !== '') {
        //     const guide = Parse.Object.extend('guide');
        //     const queryGuide = new Parse.Query(guide);
        //     queryGuide.equalTo('objectId', this.idGuide);
        //     let objGuide = await queryGuide.first();
        //     query.equalTo('objGuide', objGuide);
        // }
        // if (this.startDay !== null && this.startDay !== undefined) {
        //     query.greaterThan('startDay', this.startDay);
        // }
        // if (this.endDay !== null && this.endDay !== undefined) {
        //     query.lessThan('startDay', this.startDay);
        // }
        // if (this.objSchedule !== null && this.objSchedule !== undefined) {
        //     query.equalTo('objectId', this.objSchedule);
        // }
        if (this.location !== null && this.location !== undefined) {
            const guide = Parse.Object.extend('location');
            const queryLocation = new Parse.Query(guide);
            queryLocation.fullText('location', this.location);
            let i = await queryLocation.first();
            if (i) {
                innerQueryTour.equalTo('locations', i);
                query.matchesQuery('objTour', innerQueryTour);
            }
        }
        query.include('objTour');
        result = await query.find();
        for (let data of result) {
            this.dataSchedule.push({
                startDay: data.get('startDay'),
                endDay: data.get('endDay'),
                codeSchedule: data.get('codeSchedule'),
                nameTour: data.get('objTour').get('nameTour'),
                itinerary: data.attributes.objTour.attributes.itinerary,
            });
        }
        console.log(result);
    }
}
