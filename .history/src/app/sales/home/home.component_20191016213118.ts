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
    constructor() {
        this.tourSpecical();
    }

    ngOnInit() {}

    async tourSpecical() {
        const currentDate = new Date();
        this.specical = [];
        this.imgSpecical = [];
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('specical', true);
        query.descending('createdAt');
        query.greaterThan('endDay', currentDate);
        query.select('nameTour', 'highlights', 'adultPrice', 'childrenPrice');
        let result = await query.find();
        console.log(result);
        if (result.length > 0) {
            for (let i of result)
                this.specical.push({
                    id: i.id,
                    name: i.attributes.nameTour,
                    highlights: i.attributes.highlights,
                    priceAdult: i.attributes.adultPrice,
                    priceKids: i.attributes.childrenPrice,
                });
        }
    }
}
