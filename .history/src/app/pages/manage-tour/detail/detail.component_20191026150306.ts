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
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    constructor(private tourService: TourService) {}

    ngOnInit() {
        this.getGuide();
        this.getLocation();
        this.setup();
        this.contract();
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
    async setup() {
        this.typeTour = '';
        if (this.event.attributes.saleoff > 0) this.typeTour = 'Tour khuyến mãi';
        if (this.event.attributes.special !== null) this.typeTour = 'Tour đặc biệt';
        this.typeTour = 'Tour thông thường';
    }
    async contract() {
        this.infoCustom = [];
        this.price = 0;
        this.paid = 0;
        this.indemnification = 0;
        this.user = [];
        this.userCancel = [];
        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);
        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);

        innerQueryTour.equalTo('objectId', this.event.id);
        query.matchesQuery('objTour', innerQueryTour);
        query.include('objUser');
        let result = await query.find();
        console.log(result);
        if (result.length > 0) {
            for (let data of result) {
                this.price += data.attributes.price;
                this.paid += data.attributes.paid;
                this.indemnification += data.attributes.indemnification;
                await this.infoCustom.push({
                    infoCustom: data.attributes.infoCustom,
                });
                if (data.attributes.cancelContract.length > 0 || data.attributes.cancelTicket.length > 0) {
                    this.price -= data.attributes.price;
                    await this.userCancel.push({
                        id: data.attributes.objUser.id,
                        fullname: data.attributes.objUser.attributes.fullname,
                        phone: data.attributes.objUser.attributes.phone,
                        numberTicket: data.attributes.cancelContract.length + data.attributes.cancelTicket.length,
                    });
                }
                if (data.attributes.infoCustom.length > 0)
                    this.user.push({
                        id: data.attributes.objUser.id,
                        fullname: data.attributes.objUser.attributes.fullname,
                        phone: data.attributes.objUser.attributes.phone,
                        numberTicket: data.attributes.infoCustom.length,
                    });
                }
            }
            this.totalMoney = this.price + this.indemnification;
            this.balance = this.totalMoney - this.paid;
        }
    }
}
