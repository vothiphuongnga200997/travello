import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../shared/services/tour.service';
import * as moment from 'moment';
import { NbWindowService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'ngx-list-tourist',
    template: `
        <span class=" text-uppercase">Tống số lượng vé: </span>
        <span class="text-strong font-weight-bold text-capitalize">{{ this.quantity }}</span
        ><br />
        <span class=" text-uppercase">Tống vé người lớn: </span>
        <span class="text-strong font-weight-bold text-capitalize">{{ this.adult }}</span
        ><br />
        <span class=" text-uppercase">Tống vé trẻ em: </span>
        <span class="text-strong font-weight-bold text-capitalize">{{ this.kids }}</span
        ><br />
        <nb-card style="height:500px ; width: 750px">
            <nb-card-body>
                <ng2-smart-table [settings]="settings" [source]="source"> </ng2-smart-table>
            </nb-card-body>
        </nb-card>
    `,
})
export class ListTouristComponent implements OnInit {
    objSchedule: any;
    listTourist: Array<any>;
    kids = 0;
    adult = 0;
    quantity = 0;
    settings = {
        actions: {
            add: false,
            edit: false,
            delete: false,
        },
        columns: {
            fullname: {
                title: 'ID',
                type: 'string',
                editable: false,
            },
            phone: {
                title: 'ID',
                type: 'string',
                editable: false,
            },
            address: {
                title: 'ID',
                type: 'string',
                editable: false,
            },
            typeTicket: {
                title: 'Loại vé',
                type: 'string',
                editable: false,
            },
            representative: {
                title: 'Người đại diện',
                type: 'string',
                editable: true,
            },

            idRepresentative: {
                title: 'Khu vực',
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor(private tourService: TourService) {}
    ngOnInit() {
        this.getTourist();
    }
    async getTourist() {
        console.log(this.objSchedule);
        this.listTourist = [];
        this.kids = 0;
        this.adult = 0;
        this.quantity = 0;
        let tourist = await this.tourService.getContractSchedule(this.objSchedule);
        for (let dataTourist of tourist) {
            this.adult += dataTourist.get('numberAduslt');
            this.kids += dataTourist.get('numberKids');
            this.quantity += dataTourist.get('infoCustom').length;

            for (let infoCustom of dataTourist.get('infoCustom')) {
                this.listTourist.push({
                    fullname: infoCustom.name,
                    address: infoCustom.address,
                    typeTicket: infoCustom.type,
                    gender: infoCustom.gender,
                    phone: infoCustom.phonecustomer,
                    representative: dataTourist.get('objUser').get('fullname'),
                    idRepresentative: dataTourist.get('objUser').id,
                });
            }
        }
        this.source.load(this.listTourist);
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
