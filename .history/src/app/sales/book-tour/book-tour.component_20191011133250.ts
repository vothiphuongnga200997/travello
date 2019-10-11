import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig } from '@ngu/carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTourComponent implements OnInit {
    albums = [];
    imgags = ['assets/bg.jpg', 'assets/car.png', 'assets/canberra.jpg', 'assets/holi.jpg'];
    public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5];
    public carouselTiles = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
    };
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
        _lightboxConfig.enableTransition = true;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
        for (let i = 1; i <= 5; i++) {
            const src = '../../../assets/img/blog-img/0 (3).jpg';
            const caption = 'Image ' + i + ' caption here';
            const thumb = '../../../assets/img/blog-img/0 (3).jpg';
            const album = {
                src: src,
                caption: caption,
                thumb: thumb,
            };

            this.albums.push(album);
        }
    }

    ngOnInit() {
        this.carouselTileItems.forEach(el => {
            this.carouselTileLoad(el);
            console.log(el);
        });
    }

    public carouselTileLoad(j) {
        // console.log(this.carouselTiles[j]);
        const len = this.carouselTiles[j].length;
        if (len <= 30) {
            for (let i = len; i < len + 15; i++) {
                this.carouselTiles[j].push(this.albums[Math.floor(Math.random() * this.albums.length)]);
            }
        }
    }
}
