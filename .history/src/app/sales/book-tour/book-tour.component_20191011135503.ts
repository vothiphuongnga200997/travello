import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { NguCarouselConfig, NguCarousel } from '@ngu/carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookTourComponent implements OnInit {
    private carouselToken: string;
 
    public carouselTileItems: Array<any>;
    public carouselTile: NguCarouselConfig;
    @ViewChild('carousel',status: true) carousel: NguCarousel;
   
    constructor(private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
        _lightboxConfig.enableTransition = true;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
    }

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
}
