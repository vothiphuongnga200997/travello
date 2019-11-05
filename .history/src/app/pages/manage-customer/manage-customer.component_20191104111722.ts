import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as Parse from 'parse';
import * as moment from 'moment';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    codeTour: String;
    startDay: any;
    endDay: any;
    member: string = '';
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
    dataSourses: Array<any> = [];
    settings = {
        actions: {
            add: false,
            delete: false,
            edit: false,
        },
        columns: {
            id: {
                title: 'Mã giao dịch',
                type: 'string',
                editable: true,
            },
            fullName: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            birthday: {
                title: 'Ngày sinh',
                type: 'date',
                editable: true,
            },
            address: {
                title: 'Địa chỉ',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'number',
                editable: true,
            },
            tour: {
                title: 'Tour',
                type: 'Sting',
                editable: true,
            },
            buyer: {
                title: 'Đại diện',
                type: 'Sting',
                editable: true,
            },
            date: {
                title: 'Giờ đi - Giờ về',
                type: 'Sting',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'mytable',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };

    constructor(private contractService: ContractService, private exportAsService: ExportAsService) {
        console.log('custom');
        this.getCustom();
    }

    ngOnInit() {}
    async getCustom() {
        this.dataSourses = [];
        const customer = Parse.Object.extend('customer');
        const query = new Parse.Query(customer);
        query.include('objUser');
        let result = await query.find();
        console.log(result);
        for (let res of result) {
            if (res.get('paid') >= 100000000) this.member = 'Khách hàng VIP';
            else {
                if (res.get('paid') >= 50000000) this.member = 'Khách hàng thân thiện';
                else this.member = 'Khách hàng thường';
            }

            this.dataSourses.push({
                id: res.id,
                fullName: res.get('objUser').get('fullname'),
                phone: res.get('objUser').get('phone'),
            });
            this.source.load(this.dataSourses);
        }
    }

    async filter() {
        // this.dataSourses = [];

        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);

        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);

        if (this.codeTour !== null && this.codeTour !== undefined && this.codeTour !== '') {
            innerQueryTour.equalTo('code', this.codeTour);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.startDay !== null && this.startDay !== undefined && this.startDay !== '') {
            innerQueryTour.greaterThanOrEqualTo('startDay', new Date(this.startDay));
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.endDay !== null && this.endDay !== undefined && this.endDay !== '') {
            innerQueryTour.lessThanOrEqualTo('endDay', new Date(this.endDay));
            query.matchesQuery('objTour', innerQueryTour);
        }
        let result = await query.find();
        console.log(result);
        if (result) {
            this.dataSourses = result.map(res => {
                for (let i of res.get('infoCustom')) {
                    return {
                        id: res.id,
                        fullName: i.name,
                        phone: i.phonecustomer,
                        address: i.address,
                        birthday: i.birthday,
                        tour: res.get('objTour').get('code'),
                        buyer: res.get('objUser').get('fullname'),
                        date:
                            moment(res.get('objTour').get('startDay')).format('HH:mm DD/MM/YYYY') +
                            '-' +
                            moment(res.get('objTour').get('endDaye')).format('HH:mm DD/MM/YYYY'),
                    };
                }
            });
            this.source.load(this.dataSourses);
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
