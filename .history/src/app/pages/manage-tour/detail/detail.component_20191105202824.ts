import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { TourService } from '../../../shared/services/tour.service';
import { from } from 'rxjs';
@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    loading: boolean;
    event: any;
    listGuide: Array<any>;
    listLocation: Array<any>;
    typeTour: string;
    infoCustom: Array<any>;
    listSchedule: Array<any>;
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    constructor(private tourService: TourService) {}

    ngOnInit() {
        this.getGuide();
        this.getLocation();
        this.setup();
        this.getSchedule();
    }

    async getGuide() {
        this.listGuide = [];
        let result = await this.tourService.getGuide(this.event);
        if (result.length > 0) {
            for (let data of result) {
                this.listGuide.push({
                    fullname: data.attributes.fullname,
                });
            }
        }
    }
    async getLocation() {
        this.listLocation = [];
        let result = await this.tourService.getLocation(this.event);
        if (result.length > 0) {
            for (let data of result) {
                this.listLocation.push({
                    location: data.attributes.location,
                });
            }
        }
    }
    async getSchedule() {
        this.listSchedule = [];
        let listTourist = [];
        let i = 0;
        let kids = 0;
        let adult = 0;
        let result = await this.tourService.schedule(this.event);
        for (let data of result) {
            let tourist = await this.tourService.getContractSchedule(data);
            for (let dataTourist of tourist) {
                adult += dataTourist.get('numberAdult');
                kids += dataTourist.get('numberKids');
                this.listSchedule.push({
                    codeSchedule: data.get('codeSchedule'),
                    startDay: data.get('startDay'),
                    endDay: data.get('endDay'),
                    infoCustom: dataTourist.get('infoCustom'),
                    quantity: dataTourist.get('infoCusom').length,
                });
            }
        }
    }
    async setup() {
        this.typeTour = '';
        if (this.event.attributes.saleoff > 0) this.typeTour = 'Tour khuyến mãi';
        if (this.event.attributes.special !== null) this.typeTour = 'Tour đặc biệt';
        this.typeTour = 'Tour thông thường';
    }
}
