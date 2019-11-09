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
        let schedule = Parse.Object.extend('schedule');
        let query = new Parse.Query(schedule);
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
        if (this.endDay !== null && this.endDay !== undefined) {
            query.lessThan('startDay', this.startDay);
        }
        result = await query.find();
        console.log(result);
    }
}
