import { Component, OnInit } from '@angular/core';

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
}
