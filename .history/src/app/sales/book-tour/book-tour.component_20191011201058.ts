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
            grid: { xs: 2, sm: 3, md: 3, lg: 2, all: 0 },
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

        this.carouselTile = {
            grid: { xs: 2, sm: 3, md: 3, lg: 4, all: 0 },
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
            touch: true,
        };

        this.carouselTileOne = {
            grid: { xs: 2, sm: 3, md: 4, lg: 2, all: 0 },
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

        this.carouselTileTwo = {
            grid: { xs: 1, sm: 3, md: 4, lg: 6, all: 230 },
            speed: 600,
            interval: 3000,
            point: {
                visible: true,
            },
            load: 2,
            touch: true,
        };

        this.carouselBannerLoad();
        this.carouselTileLoad();
        this.carouselTileOneLoad();
        this.carouselTileTwoLoad();
    }

    onmoveFn(data) {
        // console.log(data);
    }

    public carouselBannerLoad() {
        const len = this.carouselBannerItems.length;
        if (len <= 4) {
            for (let i = len; i < len + 5; i++) {
                this.carouselBannerItems.push(this.imgags[Math.floor(Math.random() * this.imgags.length)]);
            }
        }
    }

    public carouselTileLoad() {
        const len = this.carouselTileItems.length;
        if (len <= 30) {
            for (let i = len; i < len + 15; i++) {
                this.carouselTileItems.push(this.imgags[Math.floor(Math.random() * this.imgags.length)]);
            }
        }
    }

    public carouselTileOneLoad() {
        const len = this.carouselTileOneItems.length;
        if (len <= 30) {
            for (let i = len; i < len + 15; i++) {
                this.carouselTileOneItems.push(this.imgags[Math.floor(Math.random() * this.imgags.length)]);
            }
        }
    }

    public carouselTileTwoLoad() {
        const len = this.carouselTileTwoItems.length;
        if (len <= 30) {
            for (let i = len; i < len + 15; i++) {
                this.carouselTileTwoItems.push(this.imgags[Math.floor(Math.random() * this.imgags.length)]);
            }
        }
    }
}
