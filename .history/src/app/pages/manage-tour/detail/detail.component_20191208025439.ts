import { Component, OnInit } from '@angular/core';
import { TourService } from '../../../shared/services/tour.service';
import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ExportAsService, SupportedExtensions, ExportAsConfig } from 'ngx-export-as';
import { CostComponent } from './cost.component';
@Component({
    selector: 'ngx-list-tourist',
    template: `
        <nb-card style="height:500px ; width: 900px">
            <nb-card-body>
                <button (click)="exportAs('xlsx')" type="button" class="btn-pages float-right">
                    <i class="fas fa-file-excel"></i> Xuất file
                </button>
                <br />
                <span class=" text-uppercase">Tống số lượng vé: </span>
                <span class="text-strong font-weight-bold text-capitalize">{{ this.quantity }}</span
                ><br />
                <span class=" text-uppercase">Tống vé người lớn: </span>
                <span class="text-strong font-weight-bold text-capitalize">{{ this.adult }}</span
                ><br />
                <span class=" text-uppercase">Tống vé trẻ em: </span>
                <span class="text-strong font-weight-bold text-capitalize">{{ this.kids }}</span
                ><br />
                <table class="table table-striped" id="mytable">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Mã hợp đồng</th>
                            <th scope="col">Họ & tên</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Loại vé</th>
                            <th scope="col">Người đại điện</th>
                            <th scope="col">Id người đại diện</th>
                            <th scope="col">Số điện thoại NĐD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let data of listTourist; index as i">
                            <th scope="row">{{ i + 1 }}</th>
                            <td scope="col">{{ data.idContract }}</td>
                            <td scope="col">{{ data.fullname }}</td>
                            <td scope="col">{{ data.phone }}</td>
                            <td scope="col">{{ data.address }}</td>
                            <td scope="col">{{ data.typeTicket }}</td>
                            <td scope="col">{{ data.representative }}</td>
                            <td scope="col">{{ data.idRepresentative }}</td>
                            <td scope="col">{{ data.phoneRepresentative }}</td>
                        </tr>
                    </tbody>
                </table>
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
    title: any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'mytable',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };
    constructor(private tourService: TourService, private exportAsService: ExportAsService) {}
    ngOnInit() {
        this.getTourist();
    }
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async getTourist() {
        console.log(this.objSchedule);
        this.listTourist = [];
        this.kids = 0;
        this.adult = 0;
        this.quantity = 0;
        let tourist = await this.tourService.getContractSchedule(this.objSchedule);
        for (let dataTourist of tourist) {
            this.adult += dataTourist.get('numberAdult');
            this.kids += dataTourist.get('numberKids');
            this.quantity += dataTourist.get('infoCustom').length;

            for (let infoCustom of dataTourist.get('infoCustom')) {
                this.listTourist.push({
                    idContract: dataTourist.id,
                    fullname: this.capital_letter(infoCustom.name),
                    address: this.capital_letter(infoCustom.address),
                    typeTicket: infoCustom.type,
                    gender: infoCustom.gender,
                    phone: infoCustom.phonecustomer,
                    representative: this.capital_letter(dataTourist.get('objUser').get('fullname')),
                    idRepresentative: dataTourist.get('objUser').id,
                    phoneRepresentative: dataTourist.get('objUser').get('phone'),
                });
            }
        }
    }
    exportAs(type: SupportedExtensions, opt?: string) {
        this.config.type = type;
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }
        this.exportAsService.save(this.config, 'myFile').subscribe(() => {});
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
    constructor(private dialogService: NbDialogService, private tourService: TourService) {}

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
        let checkDay: number;
        let result = await this.tourService.schedule(this.event);
        for (let data of result) {
            if (data.get('startDay') > Date.now()) checkDay = 1;
            else {
                checkDay = 0;
            }
            this.listSchedule.push({
                codeSchedule: data.get('codeSchedule'),
                startDay: moment(data.get('startDay')).format('DD/MM/YYYY, h:mm A'),
                endDay: moment(data.get('endDay')).format('DD/MM/YYYY, h:mm A'),
                obj: data,
                status: checkDay,
            });
        }
    }
    async getTourist(objSchedule) {
        this.dialogService.open(ListTouristComponent, {
            context: {
                title: `Thông tin hành khách`,
                objSchedule: objSchedule,
            },
        });
    }
    async setup() {
        this.typeTour = '';
        if (this.event.attributes.saleoff > 0) this.typeTour = 'Tour khuyến mãi';
        if (this.event.attributes.special !== null) this.typeTour = 'Tour đặc biệt';
        this.typeTour = 'Tour thông thường';
    }
    async inputCost(objSchedule) {
        console.log(objSchedule);
        this.dialogService.open(CostComponent, {
            context: {
                title: `Thông tin chi phí đi tour`,

                objSchedule: objSchedule,
            },
        });
    }
}
