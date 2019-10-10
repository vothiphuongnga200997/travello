import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTourComponent implements OnInit {
    imgags = ['assets/bg.jpg', 'assets/car.png', 'assets/canberra.jpg', 'assets/holi.jpg'];
    public carouselTileItems$: Observable<number[]>;
    public carouselTileConfig: NguCarouselConfig = {
        grid: { xs: 5, sm: 5, md: 5, lg: 5, all: 0 },
        speed: 3000,
        slide: 3,
        point: {
            visible: true,
        },
        load: 2,

        touch: true,
        loop: true,
        interval: { timing: 6000 },
    };
    tempData: any[];
    constructor(private cdr: ChangeDetectorRef) {}
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
