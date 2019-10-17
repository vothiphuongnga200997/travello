import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    id: string; // id từ url
    albums = [];
    src = [];
    imgags: string[];
    public carouselBannerItems: Array<any> = [];
    public carouselBanner: NgxCarousel;
    constructor(private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig, private router: ActivatedRoute) {
        _lightboxConfig.enableTransition = true;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
        this.src[0] = 'assets/img/bg-img/3.jpg';
        this.src[1] = 'assets/img/bg-img/5.jpg';
        this.src[2] = 'assets/img/bg-img/2.jpg';
        this.src[3] = 'assets/img/bg-img/6.jpg';
        this.src[4] = 'assets/img/bg-img/3.jpg';
        for (let i = 0; i <= 4; i++) {
            const src = this.src[i];
            const caption = 'Image ' + i + ' caption here';
            const thumb = 'assets/img/bg-img/5.jpg';
            const album = {
                src: src,
                caption: caption,
                thumb: thumb,
            };

            this.albums.push(album);
        }
    }

    ngOnInit() {
        this.id = this.router.snapshot.paramMap.get('id');
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
}
