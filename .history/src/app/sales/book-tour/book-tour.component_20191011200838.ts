import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTourComponent implements OnInit {
    imgags: string[];
    public carouselBannerItems: Array<any> = [];
    public carouselBanner: NgxCarousel;
    constructor() {}

    ngOnInit() {
        this.imgags = [
            'assets/img/bg-img/5.jpg',
            'assets/img/bg-img/5.jpg',
            'assets/img/bg-img/2.jpg',
            'assets/img/bg-img/3.jpg',
            'assets/img/bg-img/6.jpg',
        ];
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
            // easing: 'ease',
            animation: 'lazy',
        };
        this.carouselBannerLoad();
    }
    public carouselBannerLoad() {
        const len = this.carouselBannerItems.length;

        for (let i = len; i <= this.imgags.length; i++) {
            this.carouselBannerItems = this.imgags;
        }

        console.log(this.carouselBannerItems);
    }
}
