import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    specical: Array<any>; // danh sach tour dac biet
    imgSpecical: Array<any>; // danh sach hinh anh tung tour dac biet
    constructor() {}

    ngOnInit() {}

    async tourSpecical() {
        const currentDate = new Date();
        this.specical = [];
        this.imgSpecical = [];
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.descending('createdAt');
        query.greaterThan('endDay', currentDate);
        let result = await query.find();
        if (result.length > 0) {
        }
    }
}
