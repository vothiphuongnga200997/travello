import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'ngx-book-tour',
    template: `
        <ngu-carousel [inputs]="carouselBanner" (onMove)="onmoveFn($event)">
            <ngu-item NguCarouselItem class="bannerStyle">
                <h1>1</h1>
            </ngu-item>

            <ngu-item NguCarouselItem class="bannerStyle">
                <h1>2</h1>
            </ngu-item>

            <ngu-item NguCarouselItem class="bannerStyle">
                <h1>3</h1>
            </ngu-item>

            <button NguCarouselPrev class="leftRs">&lt;</button>
            <button NguCarouselNext class="rightRs">&gt;</button>
        </ngu-carousel>
    `,
    styles: [
        `
            .bannerStyle h1 {
                background-color: #ccc;
                min-height: 300px;
                text-align: center;
                line-height: 300px;
            }
            .leftRs {
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                width: 50px;
                height: 50px;
                box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, 0.3);
                border-radius: 999px;
                left: 0;
            }

            .rightRs {
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                width: 50px;
                height: 50px;
                box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, 0.3);
                border-radius: 999px;
                right: 0;
            }
        `,
    ],
})
export class BookTourComponent implements OnInit {
    imgags = ['assets/bg.jpg', 'assets/car.png', 'assets/canberra.jpg', 'assets/holi.jpg'];

    public carouselTile: NguCarouselConfig = {
        grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
        slide: 2,
        speed: 250,
        point: {
            visible: true,
        },
        load: 2,
        velocity: 0,
        touch: true,
        easing: 'cubic-bezier(0, 0, 0.2, 1)',
    };
    constructor(private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
        // _lightboxConfig.enableTransition = true;
        // _lightboxConfig.wrapAround = true;
        // _lightboxConfig.showImageNumberLabel = true;
    }
    carouselBanner: any;
    ngOnInit() {
        this.carouselBanner = {
            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
            slide: 1,
            speed: 400,
            interval: {
                timing: 3000,
                initialDelay: 1000,
            },
            point: {
                visible: true,
            },
            load: 2,
            loop: true,
            touch: true,
        };
    }
    onmoveFn(data: NguCarouselStore) {
        console.log(data);
    }
}
