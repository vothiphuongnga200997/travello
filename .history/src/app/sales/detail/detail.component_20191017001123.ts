import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';
import { ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import * as moment from 'moment';

@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    id: string; // id từ url
    infoTour: Array<any>; // thong tin tour
    img: Array<any>; // hinh anh tour
    albums = [];
    src = [];
    imgags: string[];
    public carouselBannerItems: Array<any> = [];
    public carouselBanner: NgxCarousel;
    constructor(private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig, private router: ActivatedRoute) {
        _lightboxConfig.enableTransition = true;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
        this.id = this.router.snapshot.paramMap.get('id');
        this.getTour(this.id);

        // this.src[0] = 'assets/img/bg-img/3.jpg';
        // this.src[1] = 'assets/img/bg-img/5.jpg';
        // this.src[2] = 'assets/img/bg-img/2.jpg';
        // this.src[3] = 'assets/img/bg-img/6.jpg';
        // this.src[4] = 'assets/img/bg-img/3.jpg';
    }

    ngOnInit() {
        this.imgags = this.src;
        console.log(this.imgags);
        this.carouselBanner = {
            grid: { xs: 2, sm: 2, md: 2, lg: 2, all: 0 },
            speed: 1000,
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
        this.carouselBannerLoad();
    }
    public carouselBannerLoad() {
        const len = this.carouselBannerItems.length;
        for (let i = len; i <= this.imgags.length; i++) {
            this.carouselBannerItems = this.imgags;
        }
    }
    open(index: number): void {
        // open lightbox
        this._lightbox.open(this.albums, index);
    }

    close(): void {
        // close lightbox programmatically
        this._lightbox.close();
    }

    async getTour(id) {
        this.infoTour = [];
        let tour = Parse.Object.extend('tour');
        let image = Parse.Object.extend('imagesTour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', id);
        let result = await query.first();
        if (result) {
            const queryImg = new Parse.Query(image);
            queryImg.equalTo('idTour', result);
            let resultImg = await queryImg.find();
            console.log(resultImg);
            this.src = [];
            for (let n = 0; n < resultImg.length; n++) {
                this.src[n] = resultImg[n].attributes.image._url;
            }
            console.log(this.src);
            for (let n of this.src) {
                const src = n;
                const caption = 'Image ' + n + ' caption here';
                const thumb = n;
                const album = {
                    src: src,
                    caption: caption,
                    thumb: thumb,
                };

                this.albums.push(album);
            }
            await this.infoTour.push({
                id: result.id,
                name: result.attributes.nameTour,
                adultPrice: result.attributes.adultPrice,
                childrenPrice: result.attributes.childrenPrice,
                departure: result.attributes.departure,
                duration: result.attributes.duration,
                empty: result.attributes.empty,
                highlights: result.attributes.highlights,
                hotel: result.attributes.hotel,
                policy: result.attributes.policy,
                saleoff: result.attributes.saleoff,
                startDay: moment(result.attributes.startDay).format('DD/MM/YYYY'),
                endDay: moment(result.attributes.endDay).format('DD/MM/YYYY'),
                vehicle: result.attributes.vehicle,
            });
        }
    }
}
