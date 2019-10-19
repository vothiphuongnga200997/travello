import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { Router } from '@angular/router';
import { NgxCarousel } from 'ngx-carousel';

@Component({
    selector: 'ngx-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    specical: Array<any>; // danh sach tour dac biet
    tourInfo: Array<any>; // select tour;
    imgSpecical: Array<any>; // danh sach hinh anh tung tour dac biet
    public carouselTileOneItems: Array<any> = [];
    public carouselTileOne: NgxCarousel;
    imgags: string[];
    constructor(private router: Router) {
        this.tourSpecical();
        this.selectTour();
    }

    ngOnInit() {
        this.imgags = [
            '../../../assets/img/bg-img/bg-5.jpg',
            '../../../assets/img/bg-img/bg-5.jpg',
            '../../../assets/img/bg-img/bg-5.jpg',
            '../../../assets/img/bg-img/bg-5.jpg',
        ];
        this.carouselTileOne = {
            grid: { xs: 2, sm: 2, md: 2, lg: 2, all: 0 },
            speed: 1500,
            interval: 4000,
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
                  border: 2px solid rgba(0, 0, 0, 0.55);
                  padding: 4px;
                  margin: 0 3px;
                  transition-timing-function: cubic-bezier(.17, .67, .83, .67);
                  transition: .4s;
                }
                .ngxcarouselPoint li.active {
                    background: #6b6b6b;
                    transform: scale(1.2);
                }
              `,
            },
            load: 2,
            loop: true,
            touch: true,
            easing: 'ease',
            animation: 'lazy',
        };
        this.carouselTileOneLoad();
    }
    public async carouselTileOneLoad() {
        const currentDate = new Date();
        this.tourInfo = [];
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

                this.tourInfo.push({
                    id: i.id,
                    name: i.attributes.nameTour,
                    highlights: i.attributes.highlights,
                    priceAdult: i.attributes.adultPrice,
                    image: resultImg[0].attributes.image._url,
                });
            }
        }

        // const len = this.carouselTileOneItems.length;
        // if (len <= 30) {
        //     for (let i = len; i < len + 15; i++) {
        //         this.carouselTileOneItems.push({
        //             image: this.imgags,
        //         });
        //     }
        // }
    }

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
    }
    async selectTour() {
        const currentDate = new Date();
        this.tourInfo = [];
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(tour);
        query.descending('createdAt');
        query.greaterThan('endDay', currentDate);
        query.select('nameTour', 'highlights', 'adultPrice', 'childrenPrice');
        query.limit(10);
        let result = await query.find();
        console.log(result);
        if (result.length > 0) {
            for (let i of result) {
                const queryImg = new Parse.Query(image);
                queryImg.equalTo('idTour', i);
                queryImg.limit(1);
                let resultImg = await queryImg.find();

                this.tourInfo.push({
                    id: i.id,
                    name: i.attributes.nameTour,
                    highlights: i.attributes.highlights,
                    priceAdult: i.attributes.adultPrice,
                    image: resultImg[0].attributes.image._url,
                });
            }
        }
        console.log(this.tourInfo);
        console.log(this.imgags);
    }
    readMore(id) {
        this.router.navigate(['/detail/' + id]);
    }
}
