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
                <div>Bạn muốn xóa vé của {{ this.info.name }}</div>
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
    info: any;
    idContract: string;
    cancelTicket: Array<any> = [];
    idTour: string;
    quantity: number;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {
        console.log('dele');
    }
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        let currentDay = moment(Date()).format('YYYY/MM/DD');
        let startDay = moment(this.startDay).format('YYYY/MM/DD');
        let firstDate = moment(startDay);
        let diffInDays = moment.duration(firstDate.diff(currentDay)).asDays();
        if (diffInDays < 7) {
            let tour = Parse.Object.extend('tour');
            let ObjectTour = new tour();

            const contract = Parse.Object.extend('contract');
            let obj = new contract();
            const query = new Parse.Query(contract);
            query.equalTo('objectId', this.idContract);
            let dataSave: any = {};
            let dataTour: any = {};

            try {
                let result = await query.first();
                if (result.attributes.cancelTicket) {
                    this.cancelTicket = result.attributes.cancelTicket;
                }
                this.info.createAt = new Date();
                this.cancelTicket.push(this.info);
                dataSave.cancelTicket = this.cancelTicket;
                dataSave.objectId = this.idContract;
                dataSave.infoCustom = this.array;
                console.log(result);
                // get so tien
                let kids = result.attributes.objTour.attributes.childrenPrice;
                let adult = result.attributes.objTour.attributes.adultPrice - result.attributes.objTour.attributes.saleoff;
                let price = result.attributes.price;
                if (this.info.type === 'Người lớn') {
                    dataSave.numberAdult = result.attributes.numberAdult - 1;
                    dataSave.price = price - adult;
                    dataSave.indemnification = adult / 2;
                }
                if (this.info.type === 'Trẻ em') {
                    dataSave.numberKids = result.attributes.numberKids - 1;
                    dataSave.price = price - kids;
                    dataSave.indemnification = kids / 2;
                }
                let save = await obj.save(dataSave);
                if (save) {
                    dataTour.empty = await this.contractService.setEmpty(this.idTour, this.quantity);
                    dataTour.objectId = this.idTour;
                    let objTour = await ObjectTour.save(dataTour);
                }
                this.ref.close({
                    pennant: true,
                });
            } catch (ex) {
                throw ex;
            }
        } else {
            let tour = Parse.Object.extend('tour');
            let ObjectTour = new tour();

            const contract = Parse.Object.extend('contract');
            let obj = new contract();
            const query = new Parse.Query(contract);
            query.equalTo('objectId', this.idContract);
            let dataSave: any = {};
            let dataTour: any = {};

            try {
                let result = await query.first();
                this.info.createAt = new Date();
                dataSave.objectId = this.idContract;
                dataSave.infoCustom = this.array;
                // get so tien
                let kids = result.attributes.objTour.attributes.childrenPrice;
                let adult = result.attributes.objTour.attributes.adultPrice - result.attributes.objTour.attributes.saleoff;
                let price = result.attributes.price;
                if (this.info.type === 'Người lớn') {
                    dataSave.numberAdult = result.attributes.numberAdult - 1;
                    dataSave.price = price - adult;
                }
                if (this.info.type === 'Trẻ em') {
                    dataSave.numberKids = result.attributes.numberKids - 1;
                    dataSave.price = price - kids;
                }
                let save = await obj.save(dataSave);
                if (save) {
                    dataTour.empty = await this.contractService.setEmpty(this.idTour, this.quantity);
                    dataTour.objectId = this.idTour;
                    let objTour = await ObjectTour.save(dataTour);
                }
                this.ref.close({
                    pennant: true,
                });
            } catch (ex) {
                throw ex;
            }
        }
    }
}
