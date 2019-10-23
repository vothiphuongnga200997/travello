import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../shared/services/contract.service';
import * as moment from 'moment';
import * as Parse from 'parse';
@Component({
    selector: 'ngx-contract',
    styleUrls: ['./delete-customer.scss'],
    template: `
        <nb-card>
            <nb-card-header>
                {{ title }}
                <h6 class="close " aria-label="Close" (click)="dismiss()">
                    <span aria-hidden="true">&times;</span>
                </h6>
            </nb-card-header>
            <nb-card-body>
                <div>Bạn muốn xóa hợp đồng {{ this.id }}</div>
                <div class="footer">
                    <button class="float-right btn btn-info" (click)="delete()">OK</button>
                    <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteComponent implements OnInit {
    id: String;
    title: String;
    idTour: string;
    quantity: number;
    tourist: any;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {}
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        console.log(this.id, this.idTour, this.quantity, this.tourist);
        let i = await this.contractService.deleteContract(this.id, this.idTour, this.quantity, this.tourist);
        if (i) {
            this.ref.close({
                pennant: true,
            });
        }
    }
}
@Component({
    selector: 'ngx-contract',
    styleUrls: ['./delete-customer.scss'],
    template: `
        <nb-card>
            <nb-card-header>
                {{ title }}
                <h6 class="close " aria-label="Close" (click)="dismiss()">
                    <span aria-hidden="true">&times;</span>
                </h6>
            </nb-card-header>
            <nb-card-body>
                <div>Bạn muốn xóa vé của</div>
                <div class="footer">
                    <button class="float-right btn btn-info" (click)="delete()">OK</button>
                    <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteTicketComponent implements OnInit {
    title: string;
    startDay: any;
    array: Array<any>;
    info: any = {};
    idContract: string;
    cancelTicket: Array<any>;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {
        console.log('dele');
    }
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        console.log(this.info);
        console.log(this.idContract);
        console.log(this.array);
        console.log(this.startDay);
        let currentDay = moment(Date()).format('YYYY/MM/DD');
        let startDay = moment(this.startDay).format('YYYY/MM/DD');
        let firstDate = moment(startDay);
        let diffInDays = moment.duration(firstDate.diff(currentDay)).asDays();
        if (diffInDays < 7) {
            const contract = Parse.Object.extend('contract');
            let obj = new contract();
            const query = new Parse.Query(contract);
            query.equalTo('objectId', this.idContract);
            let dataSave: any = {};
            try {
                let result = await query.first();
                if (result.attributes.CancelTicket) {
                    this.cancelTicket = result.attributes.CancelTicket;
                }
                this.cancelTicket.push({
                    name: this.info.name,
                    phone: this.info.phonecustomer,
                    address: this.info.address,
                    gender: this.info.gender,
                    type: this.info.type,
                });
                dataSave.CancelTicket = this.cancelTicket;
                if (this.info.type === 'Người lớn') {
                    dataSave.numberAdult = result.attributes.numberAdult - 1;
                }
                if (this.info.type === 'Trẻ em') {
                    dataSave.numberKids = result.attributes.numberKids - 1;
                }
                let save = await obj.save(dataSave);
            } catch (ex) {
                throw ex;
            }
            // let dataSave: any = {};
            // dataSave.infoCustom = this.array;
            // dataSave.cancelTicket = this.info;
        } else {
            console.log(diffInDays);
        }
    }
}
