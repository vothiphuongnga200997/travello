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
    constructor() {}
    ngOnInit() {}
    async filter() {
        let result: any;
        let currentDate = new Date();
        let schedule = Parse.Object.extend('schedule');
        let query = new Parse.Query(schedule);
        if (this.idGuide !== '') {
            const guide = Parse.Object.extend('guide');
            const queryGuide = new Parse.Query(guide);
            queryGuide.equalTo('objectId', this.idGuide);
            result = await queryGuide.first();
            query.equalTo('objGuide', result);
        }
        if (this.location !== '') {
            const location = Parse.Object.extend('location');
            const queryLocation = new Parse.Query(location);
            const tour = Parse.Object.extend('tour');
            const queryTour = new Parse.Query(tour);
            queryLocation.fullText('objectId', this.idGuide);
            result = await queryLocation.first();
            queryTour.equalTo('locations', result);
            let objTour = queryTour.first();
            query.equalTo('objTour', objTour);
        }
    }
}