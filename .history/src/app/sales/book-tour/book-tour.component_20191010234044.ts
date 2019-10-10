import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig } from '@ngu/carousel';

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
        point: {
            visible: true,
        },
        touch: true,
        loop: true,
        interval: { timing: 6000 },
    };
    tempData: any[];
    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.tempData = [];
        this.carouselTileItems$ = interval(1500).pipe(
            startWith(-1),
            take(1),
            map(val => {
                const data = (this.tempData = [...this.tempData, this.imgags[Math.floor(Math.random() * this.imgags.length)]]);
                return data;
            }),
        );
    }
}
