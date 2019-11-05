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
    price: number; // tổng tiền vé đặt
    indemnification: number; // tiền bồi thường
    paid: number; // so tien da nhan
    totalMoney: number; //  tong tat ca so tien
    balance: number; // so tien còn lại
    userCancel: Array<any>; // danh sach khach hang da huy tour
    user: Array<any>; // danh sach khach hang da dat tour
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
        console.log(this.event);
        let result = await this.tourService.schedule(this.event);
        console.log(result);
    }
    async setup() {
        this.typeTour = '';
        if (this.event.attributes.saleoff > 0) this.typeTour = 'Tour khuyến mãi';
        if (this.event.attributes.special !== null) this.typeTour = 'Tour đặc biệt';
        this.typeTour = 'Tour thông thường';
    }
    async getSchedule() {
        this.listSchedule = [];
        let result = await this.tourService.querySchedule(this.event);
        if (result) {
        }
    }
}
