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
        const currentDate = new Date();
        const schedule = Parse.Object.extend('schedule');
        const query = new Parse.Query(schedule);
        if (this.idGuide !== '') {
            const guide = Parse.Object.extend('guide');
            const queryGuide = new Parse.Query(guide);
            queryGuide.equalTo('objectId', this.idGuide);
            const result = queryGuide.first();
        }
    }
}
