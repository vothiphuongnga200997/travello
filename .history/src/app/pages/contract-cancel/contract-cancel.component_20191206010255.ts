import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as Parse from 'parse';
import * as moment from 'moment';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ContractService } from '../../shared/services/contract.service';
@Component({
    moduleId: module.id,
    selector: 'status',
    template: `
        <div>
            <a class="d-flex justify-content-center text-success" *ngIf="value == 1"> Mở </a>
            <a class="d-flex justify-content-center text-warning" *ngIf="value == 0"> Đóng </a>
        </div>
    `,
})
export class StatusComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }
}
@Component({
    moduleId: module.id,
    selector: 'button-contract',
    template: `
        <div class="download">
            <a class="d-flex justify-content-center" (click)="onClick()"
                ><img style="height: 25px;width: 25px;" src="../../../assets/images/calendar.png"
            /></a>
        </div>
    `,
})
export class ButtonComponent implements ViewCell, OnInit {
    renderValue: string;
    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}
@Component({
    selector: 'ngx-contract-cancel',
    templateUrl: './contract-cancel.component.html',
    styleUrls: ['./contract-cancel.component.scss'],
})
export class ContractCancelComponent implements OnInit {
    settings = {
        actions: {
            add: false,
            edit: false,
            delete: false,
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
            dayCancel: {
                title: 'Ngày hủy',
                type: 'string',
                editable: true,
            },
            createAt: {
                title: 'Ngày đặt',
                type: 'string',
                editable: true,
            },
            status: {
                title: 'Trạng thái',
                type: 'custom',
                renderComponent: StatusComponent,
            },
            task: {
                title: 'Chi tiết',
                type: 'custom',
                renderComponent: ButtonComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {
                        // this.taskInfo(row.id, row.status);
                    });
                },
                filter: false,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    contractCancel: Array<any> = [];
    constructor(private contractService: ContractService) {
        this.getContractCanceled();
    }

    ngOnInit() {}
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
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
                this.contractCancel = [];
                if (result) {
                    console.log(result);
                    for (let data of result) {
                        querySchedule.equalTo('objectId', data.get('objSchedule').id);
                        querySchedule.include('objTour');
                        let resultShedule = await querySchedule.first();
                        let email = await this.contractService.getUserId(data.get('objUser').id);
                        this.contractCancel.push({
                            id: data.id,
                            fullname: this.capital_letter(data.get('objUser').get('fullname')),
                            email: email.attributes.email,
                            phone: data.get('objUser').get('phone'),
                            quantity: data.get('numberKids') + data.get('numberAdult'),
                            createAt: moment(data.get('date')).format('DD/MM/YYYY'),
                            dayCancel: moment(data.get('updateAt')).format('DD/MM/YYYY, h:mm A'),
                            // tour: data.get('objSchedule').get('codeSchedule'),
                            // nameTour: resultShedule.get('objTour').get('nameTour'),
                            // startDay: moment(data.get('objSchedule').get('startDay')).format('DD/MM/YYYY'),
                            // tourist: data.get('infoCustom'),
                            // price: data.get('price'),
                            // idUser: data.get('objUser'),
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
