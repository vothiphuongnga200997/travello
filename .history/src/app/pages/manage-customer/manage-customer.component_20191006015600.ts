import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as Parse from 'parse';
import * as moment from 'moment';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    codeTour: String;
    startDay: any;
    endDay: any;
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
    dataSourses: any;
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
                tilte: 'Đại diện',
                type: 'Sting',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();

    constructor(private contractService: ContractService) {
        console.log('custom');
        this.getCustom();
    }

    ngOnInit() {}
    async getCustom() {
        let result = await this.contractService.getContrat();
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
                    };
                }
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
            innerQueryTour.fullText('code', this.codeTour);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.startDay !== null && this.startDay !== undefined && this.startDay !== '') {
            innerQueryTour.greaterThan('startDay', new Date(this.startDay));
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.endDay !== null && this.endDay !== undefined && this.endDay !== '') {
            innerQueryTour.lessThan('endDay', new Date(this.endDay));
            query.matchesQuery('objTour', innerQueryTour);
        }
        let result = await query.find();
        console.log(result);
        // if (result) {
        //     result.map(data => {
        //         this.dataSourses.push({
        //             id: data.id,
        //             representative: data.get('objUser').get('fullname'),
        //             tour: data.get('objTour').get('code'),
        //             idTour: data.get('objTour').id,
        //             nameTour: data.get('objTour').get('nameTour'),
        //             startDay: moment(data.get('objTour').get('startDay')).format('DD/MM/YYYY'),
        //             endDay: moment(data.get('objTour').get('endDay')).format('DD/MM/YYYY'),
        //             tourist: data.get('infoCustom'),
        //             price: data.get('price'),
        //             quantity: data.get('infoCustom').length,
        //         });
        //     });
        // }
    }
}
