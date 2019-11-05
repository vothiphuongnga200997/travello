import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../shared/services/tour.service';
import * as moment from 'moment';
import { NbDialogService, NbWindowService } from '@nebular/theme';

@Component({
    selector: 'ngx-list-tourist',
    template: `
        <p>nga</p>
    `,
    styleUrls: ['./detail.component.scss'],
})
export class ListTouristComponent implements OnInit {
    objSchedule: any;
    listTourist: Array<any>;
    constructor(private tourService: TourService) {
        this.getTourist();
    }
    ngOnInit() {}
    async getTourist() {
        this.listTourist = [];
        let kids = 0;
        let adult = 0;
        let quantity = 0;
        let tourist = await this.tourService.getContractSchedule(this.objSchedule);
        for (let dataTourist of tourist) {
            adult += dataTourist.get('numberAduslt');
            kids += dataTourist.get('numberKids');
            quantity += dataTourist.get('infoCustom').length;
            this.listTourist.push({
                infoCustom: dataTourist.get('infoCustom'),
                quantity: quantity,
                numberAdult: adult,
                kids: kids,
            });
        }
        console.log(this.listTourist);
    }
}
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
    listTourist: Array<any>;
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    constructor(private tourService: TourService, private windowService: NbWindowService) {}

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
        let result = await this.tourService.schedule(this.event);
        for (let data of result) {
            this.listSchedule.push({
                codeSchedule: data.get('codeSchedule'),
                startDay: moment(data.get('startDay')).format('DD/MM/YYYY, h:mm A'),
                endDay: moment(data.get('endDay')).format('DD/MM/YYYY, h:mm A'),
                obj: data,
            });
        }
    }
    async getTourist(objSchedule) {
        this.windowService
            .open(ListTouristComponent, {
                title: `Thông tin hành khách`,
                context: {
                    objSchedule: objSchedule,
                },
            })
            .onClose.subscribe();
    }
    async setup() {
        this.typeTour = '';
        if (this.event.attributes.saleoff > 0) this.typeTour = 'Tour khuyến mãi';
        if (this.event.attributes.special !== null) this.typeTour = 'Tour đặc biệt';
        this.typeTour = 'Tour thông thường';
    }
}
