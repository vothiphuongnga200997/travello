import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    specical: Array<any>; // danh sach tour dac biet
    tour: Array<any>; // select tour;
    imgSpecical: Array<any>; // danh sach hinh anh tung tour dac biet
    constructor(private router: Router) {
        this.tourSpecical();
    }

    ngOnInit() {}

    async tourSpecical() {
        const currentDate = new Date();
        this.specical = [];
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(tour);
        query.equalTo('specical', true);
        query.descending('createdAt');
        query.greaterThan('endDay', currentDate);
        query.select('nameTour', 'highlights', 'adultPrice', 'childrenPrice');
        let result = await query.find();
        if (result.length > 0) {
            for (let i of result) {
                const queryImg = new Parse.Query(image);
                queryImg.equalTo('idTour', i);
                queryImg.limit(3);
                let resultImg = await queryImg.find();
                this.imgSpecical = [];
                for (let n of resultImg) {
                    this.imgSpecical.push({
                        url: n.attributes.image._url,
                    });
                }
                this.specical.push({
                    id: i.id,
                    name: i.attributes.nameTour,
                    highlights: i.attributes.highlights,
                    priceAdult: i.attributes.adultPrice,
                    priceKids: i.attributes.childrenPrice,
                    img: this.imgSpecical,
                });
            }
        }
        console.log(this.specical);
    }
    async selectTour() {
        const currentDate = new Date();
        this.specical = [];
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(tour);
        query.descending('createdAt');
        query.greaterThan('endDay', currentDate);
        query.select('nameTour', 'highlights', 'adultPrice', 'childrenPrice');
        query.limit(10);
        let result = await query.find();
        if (result.length > 0) {
            for (let i of result) {
                const queryImg = new Parse.Query(image);
                queryImg.equalTo('idTour', i);
                queryImg.limit(1);
                let resultImg = await queryImg.find();
                console.log(resultImg);
                // this.imgSpecical = [];
                // for (let n of resultImg) {
                //     this.imgSpecical.push({
                //         url: n.attributes.image._url,
                //     });
                // }
                this.tour.push({
                    id: i.id,
                    name: i.attributes.nameTour,
                    highlights: i.attributes.highlights,
                    priceAdult: i.attributes.adultPrice,
                    img: this.imgSpecical,
                });
            }
        }
    }
    readMore(id) {
        this.router.navigate(['/detail/' + id]);
    }
}
