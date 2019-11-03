import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { Router } from '@angular/router';
import { NgxCarousel } from 'ngx-carousel';
import { TourService } from '../../shared/services/tour.service';
import * as moment from 'moment';

@Component({
    selector: 'ngx-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    specical: Array<any>; // danh sach tour dac biet
    tourInfo: Array<any>; // select tour;
    tourLocation: Array<any>;
    imgSpecical: Array<any>; // danh sach hinh anh tung tour dac biet
    public carouselTileOneItems: Array<any> = [];
    public carouselTileOne: NgxCarousel;
    imgags: string[];
    constructor(private router: Router, private tourService: TourService) {
        this.tourSpecical();
        this.selectTour();
    }

    ngOnInit() {
        this.carouselTileOne = {
            grid: { xs: 3, sm: 3, md: 3, lg: 3, all: 0 },
            speed: 600,
            interval: 3000,
            point: {
                visible: true,
                pointStyles: `
                .ngxcarouselPoint {
                  list-style-type: none;
                  text-align: center;
                  padding: 12px;
                  margin: 0;
                  white-space: nowrap;
                  overflow: auto;
                  box-sizing: border-box;
                }
                .ngxcarouselPoint li {
                  display: inline-block;
                  border-radius: 50%;
                  background: #6b6b6b;
                  padding: 5px;
                  margin: 0 3px;
                  transition: .4s;
                }
                .ngxcarouselPoint li.active {
                    border: 2px solid rgba(0, 0, 0, 0.55);
                    transform: scale(1.2);
                    background: transparent;
                  }
              `,
            },
            load: 2,
            loop: true,
            touch: true,
            easing: 'ease',
            animation: 'lazy',
        };
    }

    async tourSpecical() {
        const currentDate = new Date();
        this.specical = [];
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(tour);
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);

        query.equalTo('specical', true);
        query.select('nameTour', 'highlights', 'adultPrice', 'childrenPrice');
        let result = await query.find();
        if (result.length > 0) {
            for (let i of result) {
                querySchedule.equalTo('objTour', i);
                querySchedule.greaterThan('endDay', currentDate);
                querySchedule.descending('startDay');
                let objschedule = await querySchedule.first();
                if (objschedule) {
                    const queryImg = new Parse.Query(image);
                    queryImg.equalTo('idTour', i);
                    queryImg.limit(3);
                    let resultImg = await queryImg.find();
                    this.imgSpecical = [];
                    for (let n of resultImg) {
                        await this.imgSpecical.push({
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
        }
        console.log(this.specical);
    }
    async selectTour() {
        const currentDate = new Date();
        this.tourInfo = [];
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);

        const query = new Parse.Query(tour);
        query.select('nameTour', 'highlights', 'adultPrice', 'childrenPrice');
        query.greaterThan('saleoff', 0);
        query.limit(5);
        let result = await query.find();
        if (result.length > 0) {
            for (let i of result) {
                querySchedule.equalTo('objTour', i);
                querySchedule.greaterThan('endDay', currentDate);
                querySchedule.descending('startDay');
                let objschedule = await querySchedule.first();
                if (objschedule) {
                    const queryImg = new Parse.Query(image);
                    queryImg.equalTo('idTour', i);
                    queryImg.limit(3);
                    let resultImg = await queryImg.first();
                    this.imgSpecical = [];
                    for (let n of resultImg) {
                        await this.imgSpecical.push({
                            url: n.attributes.image._url,
                        });
                    }
                    this.tourInfo.push({
                        id: i.id,
                        name: i.attributes.nameTour,
                        highlights: i.attributes.highlights,
                        priceAdult: i.attributes.adultPrice,
                        image: resultImg.attributes.image._url,
                        startDay: moment(i.attributes.startDay).format('DD/MM/YYYY'),
                        endDay: moment(i.attributes.endDay).format('DD/MM/YYYY'),
                        location: this.tourLocation,
                    });
                }
            }
        }
        console.log(this.tourInfo);
    }
    readMore(id) {
        this.router.navigate(['/detail/' + id]);
    }
}
