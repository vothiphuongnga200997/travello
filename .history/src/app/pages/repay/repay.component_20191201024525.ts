import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import * as Parse from 'parse';
import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from '../../shared/services';
import { TourService } from '../../shared/services/tour.service';

export class info implements OnInit {
    event: any; // id Contract
    status: string;
    data: Array<any> = [];
    user: Array<any> = [];
    idTour: string;
    startDay: any;
    quantity: number;
    idUser: any;
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService, private tourService: TourService) {}

    ngOnInit() {
        this.getInfo();
    }

    deleteArray: Array<any>;
    async getInfo() {
        this.data = [];
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objTour');
        query.include('objUser');
        query.equalTo('objectId', this.event);
        query.select('objTour', 'objUser', 'infoCustom');
        try {
            let result = await query.first();
            if (result) {
                let schedule = await this.tourService.querySchedule(result.get('objSchedule').id);
                this.data = result.attributes.infoCustom;
                this.idTour = schedule.id;
                this.startDay = schedule.attributes.startDay;
                this.idUser = result.attributes.objUser;
                this.quantity = schedule.attributes.objTour.attributes.quantity;
                this.user = [];
                const queryUser = new Parse.Query(Parse.User);
                queryUser.equalTo('objectId', result.get('objUser').id);
                console.log(result);
                try {
                    let resultUser = await queryUser.first({ useMasterKey: true });
                    if (resultUser) {
                        const customer = Parse.Object.extend('customer');
                        const queryCustomer = new Parse.Query(customer);
                        queryCustomer.equalTo('objUser', resultUser);
                        let resultCustome = await queryCustomer.first();
                        let i = 0;
                        if (resultCustome) {
                            i = resultCustome.get('discount');
                        }
                        this.user.push({
                            fullname: resultUser.get('fullname'),
                            email: resultUser.get('email'),
                            phone: resultUser.get('phone'),
                            member: i,
                            idSchedule: result.get('objSchedule').get('codeSchedule'),
                            startDay: moment(result.get('objSchedule').get('startDay')).format('DD/MM/YYYY, h:mm A'),
                            endDay: moment(result.get('objSchedule').get('endDay')).format('DD/MM/YYYY, h:mm A'),
                        });
                    }
                } catch (ex) {
                    throw ex;
                }
            }
        } catch (ex) {
            throw ex;
        }
    }
}
@Component({
    selector: 'ngx-repay',
    templateUrl: './repay.component.html',
    styleUrls: ['./repay.component.scss'],
})
export class RepayComponent implements OnInit {
    settings = {
        actions: {
            add: false,
            edit: false,
            delete: false,
        },
        columns: {
            id: {
                title: 'Id',
                type: 'string',
                editable: true,
            },
            fullname: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            email: {
                title: 'Email',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'string',
                editable: true,
            },
            repay: {
                title: 'Tiền hoàn trả',
                type: 'string',
                editable: true,
            },
            contract: {
                title: 'contract',
                type: 'list',
                editable: false,
            },
            status: {
                title: 'Trạng thái',
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor() {
        this.getRepay();
    }

    ngOnInit() {}
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async getRepay() {
        const Repay = Parse.Object.extend('repay');
        const query = new Parse.Query(Repay);
        query.include('objContract');
        let list = [];
        let result = await query.find();
        if (result.length > 0) {
            for (let res of result) {
                const queryUser = new Parse.Query(Parse.User);
                queryUser.equalTo('objectId', res.attributes.objContract.attributes.objUser.id);
                queryUser.select('fullname', 'phone', 'email');
                queryUser.lessThan('status', 0);
                try {
                    let resultUser = await queryUser.first({ useMasterKey: true });
                    if (resultUser) {
                        list.push({
                            res: res,
                            id: res.id,
                            fullname: this.capital_letter(resultUser.get('fullname')),
                            email: resultUser.get('email'),
                            phone: resultUser.get('phone'),
                            repay: res.get('repay'),
                        });
                    }
                } catch (ex) {
                    throw ex;
                }
                console.log(list);
                this.source.load(list);
            }
        }
    }
}
