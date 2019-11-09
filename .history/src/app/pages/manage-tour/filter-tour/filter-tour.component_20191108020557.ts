import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-filter-tour',
    templateUrl: './filter-tour.component.html',
    styleUrls: ['./filter-tour.component.scss'],
})
export class FilterTourComponent implements OnInit {
    // filter
    location: string;
    area: string;
    idGuide: string;
    startDay: any;
    endDay: any;
    departure: string;
    constructor() {}
    ngOnInit() {}
    async filter() {
        let schedule = Parse.Object.extend('schedule');
        let query = new Parse.Query(schedule);
    }
}
