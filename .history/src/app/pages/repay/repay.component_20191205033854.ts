import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import * as Parse from 'parse';
import { ButtonStatusEnum, DialogInterface } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
@Component({
    moduleId: module.id,
    selector: 'pay-view',
    styleUrls: ['./repay.component.scss'],
    template: `
        <label class="switch">
            <input type="checkbox" [checked]="this.value" />
            <span class="slider round"></span>
        </label>
    `,
})
export class pay implements ViewCell, OnInit {
    renderValue: string;
    @Input() value: any;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    @ViewChild('confirmDeleteDialog', { static: true }) deleteDialog: DialogComponent;
    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }
    pay(event) {
        this.dialogConfig = {
            title: 'XÓA HƯỚNG DẪN VIÊN',
            content: `BẠN MUỐN XÓA HDV ${event.data}?`,
            data: event.data,
            rightBtnLabel: 'OK',
            leftBtnLabel: 'Cancel',
            rightBtnStatus: ButtonStatusEnum.Info,
            leftBtnStatus: ButtonStatusEnum.Hint,
        };
        this.deleteDialog.open();
    }
    onClick() {
        this.save.emit(this.rowData);
    }
}
@Component({
    moduleId: module.id,
    selector: 'pay-view',
    template: `
        <div style="width:150px">
            <b>{{ this.code }}</b>
            <br />
            <p *ngIf="!this.status">Hợp đồng đã xóa</p>
        </div>
    `,
})
export class codeContract implements ViewCell, OnInit {
    renderValue: string;
    @Input() value: any;
    @Input() rowData: any;
    code: string;
    status: boolean;
    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
        console.log(this.value);
        this.code = this.value[0].code;
        this.status = this.value[0].status;
    }

    onClick() {
        this.save.emit(this.rowData);
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
            status: {
                title: 'Trạng thái',
                type: 'custom',
                renderComponent: pay,
            },
            codeContract: {
                title: 'Mã hợp đồng',
                type: 'custom',
                renderComponent: codeContract,
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
                    let contract = [];
                    contract.push({
                        status: res.get('objContract').get('status'),
                        code: res.get('objContract').id,
                    });
                    let resultUser = await queryUser.first({ useMasterKey: true });
                    if (resultUser) {
                        list.push({
                            res: res,
                            id: res.id,
                            fullname: this.capital_letter(resultUser.get('fullname')),
                            email: resultUser.get('email'),
                            phone: resultUser.get('phone'),
                            repay: res.get('repay'),
                            status: res.get('status'),
                            codeContract: contract,
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
