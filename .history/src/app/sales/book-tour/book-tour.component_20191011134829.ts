import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
