import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from 'parse';
import * as moment from 'moment';
import { TourService } from '../../shared/services/tour.service';
import * as ClassicEditor from 'ng2-ckeditor';
import { ExportAsService, SupportedExtensions, ExportAsConfig } from 'ngx-export-as';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbDialogService } from '@nebular/theme';
declare var FB: any;

@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    public Editor = ClassicEditor;
    public onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    }
    id: string; // id từ url
    infoTour: Array<any>; // thong tin tour
    img: Array<any>; // hinh anh tour
    location: Array<any>;
    albums = [];
    src = [];
    images: string[];
    public carouselBannerItems: Array<any> = [];
    public carouselBanner: NgxCarousel;
    config: ExportAsConfig = {
        type: 'docx',
        elementId: 'txt',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };
    constructor(
        private exportAsService: ExportAsService,
        private tourService: TourService,
        private _lightbox: Lightbox,
        private _lightboxConfig: LightboxConfig,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router,

        private dialogService: NbDialogService,
    ) {
        _lightboxConfig.enableTransition = true;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
        this.id = this.route.snapshot.paramMap.get('id');
        this.getTour(this.id);
        this.getImg(this.id);
    }
    ngOnInit() {
        this.carouselBanner = {
            grid: { xs: 2, sm: 2, md: 2, lg: 2, all: 0 },
            speed: 1500,
            interval: 4000,
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
    }
    public carouselBannerLoad() {
        const len = this.carouselBannerItems.length;
        for (let i = len; i <= this.images.length; i++) {
            this.carouselBannerItems = this.images;
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
        this.location = [];
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        query.equalTo('objectId', id);
        let result = await query.first();
        if (result) {
            let i = await this.tourService.getLocation(result);
            this.location = await i.map(res => {
                return {
                    location: res.attributes.location,
                };
            });
            console.log(this.location);
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
                itinerary: result.attributes.itinerary,
            });
        }
    }

    async getImg(id) {
        let tour = Parse.Object.extend('tour');
        const query = new Parse.Query(tour);
        let image = Parse.Object.extend('imagesTour');
        query.equalTo('objectId', id);
        let result = await query.first();
        if (result) {
            const queryImg = new Parse.Query(image);
            queryImg.equalTo('idTour', result);
            let resultImg = await queryImg.find();
            this.src = [];
            for (let n = 0; n < resultImg.length; n++) {
                this.src[n] = resultImg[n].attributes.image._url;
            }
            this.images = this.src; // images

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
        }
        this.carouselBannerLoad();
    }

    exportAs(type: SupportedExtensions, opt?: string) {
        this.config.type = type;
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }
        this.exportAsService.save(this.config, 'myFile').subscribe(() => {});
    }

    book() {
        this.router.navigate(['/book-tour/' + this.id]);
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    async loginFB() {
        console.log('submit login to facebook');
        try {
            const users = await Parse.FacebookUtils.logIn();
            if (!users.existed()) {
                alert('User signed up and logged in through Facebook!');
            } else {
                await FB.api('me?fields:name', async function(response) {
                    await users.set('fullname', response.name);
                    await users.set('status', -1);
                    await users.save();
                    await Parse.User.become(users.get('sessionToken'));
                });
                this.router.navigate(['/book-tour/' + this.id]);
            }
        } catch (error) {
            alert('Người dùng đã hủy đăng nhập Facebook.');
        }
    }
}
