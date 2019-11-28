import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { ContractService } from '../../shared/services/contract.service';

@Component({
    selector: 'ngx-contract-cancel',
    templateUrl: './contract-cancel.component.html',
    styleUrls: ['./contract-cancel.component.scss'],
})
export class ContractCancelComponent implements OnInit {
    settings = {
        actions: {
            add: false,
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        mode: 'external',
        columns: {
            id: {
                title: 'Mã giao dịch',
                type: 'string',
                editable: true,
            },
            fullname: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'number',
                editable: true,
            },
            quantity: {
                title: 'Số lượng',
                type: 'number',
                editable: true,
            },
            tour: {
                title: 'Tour',
                type: 'string',
                editable: true,
            },
            pay: {
                title: 'Thanh toán',
                type: 'string',
                editable: true,
            },
            createAt: {
                title: 'Ngày đặt',
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    contractCancel: Array<any> = [];
    constructor(private contractService: ContractService) {}

    ngOnInit() {}
    async getContractCanceled() {
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objSchedule');
        query.include('objUser');
        query.equalTo('status', false);
        query.descending('date');
        try {
            let result = await query.find();
            if (result.length > 0) {
                let schedule = Parse.Object.extend('schedule');
                const querySchedule = new Parse.Query(schedule);
                let dateNow = new Date();
                this.contractCancel = [];
                if (result) {
                    for (let data of result) {
                        querySchedule.equalTo('objectId', data.get('objSchedule').id);
                        querySchedule.include('objTour');
                        let resultShedule = await querySchedule.first();
                        let email = await this.contractService.getUserId(data.get('objUser').id);
                        let startDate = moment(data.get('date'), 'DD/MM/YYYY');
                        let currenDate = moment(new Date()).format('DD/MM/YYYY');
                        let endDate = moment(currenDate, 'DD/MM/YYYY');
                        let diffInDays = endDate.diff(startDate, 'days');
                        this.contractCancel.push({
                            id: data.id,
                            fullname: data.get('objUser').get('fullname'),
                            email: email.attributes.email,
                            phone: data.get('objUser').get('phone'),
                            quantity: data.get('numberKids') + data.get('numberAdult'),
                            createAt: moment(data.get('createAt')).format('DD/MM/YYYY'),
                            tour: data.get('objSchedule').get('codeSchedule'),
                            idSchedule: data.get('objSchedule').id,
                            nameTour: resultShedule.get('objTour').get('nameTour'),
                            startDay: moment(data.get('objSchedule').get('startDay')).format('DD/MM/YYYY'),
                            tourist: data.get('infoCustom'),
                            price: data.get('price'),
                            tourQuantity: resultShedule.get('objTour').get('quantity'),
                            idUser: data.get('objUser'),
                            paid: data.get('paid'),
                        });
                    }
                }
                this.source.load(this.contractCancel);
            }
        } catch (ex) {
            throw ex;
        }
    }
}