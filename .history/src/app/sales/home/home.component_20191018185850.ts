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
        this.carouselTileOneLoad();
    }
    public carouselTileOneLoad() {
        const len = this.carouselTileOneItems.length;
        if (len <= 30) {
            for (let i = len; i < len + 15; i++) {
                this.carouselTileOneItems.push({
                    image: this.imgags,
                });
            }
        }
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
                this.tourInfo.push({
                    id: i.id,
                    name: i.attributes.nameTour,
                    highlights: i.attributes.highlights,
                    priceAdult: i.attributes.adultPrice,
                });
                const queryImg = new Parse.Query(image);
                queryImg.equalTo('idTour', i);
                queryImg.limit(1);
                let resultImg = await queryImg.find();
                this.imgags[i.length] = resultImg[0].attributes.image._url;
            }
        }
        console.log(this.tourInfo);
        console.log(this.imgags);
    }
    readMore(id) {
        this.router.navigate(['/detail/' + id]);
    }
}
