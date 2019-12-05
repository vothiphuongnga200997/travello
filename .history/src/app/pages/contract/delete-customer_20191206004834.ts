import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../shared/services/contract.service';
import * as moment from 'moment';
import * as Parse from 'parse';
import { TourService } from '../../shared/services/tour.service';
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
                <div>Bạn muốn xóa hợp đồng {{ this.event.id }}</div>
                <div class="footer">
                    <button class="float-right btn btn-info" (click)="delete()">OK</button>
                    <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteComponent implements OnInit {
    title: String;
    event: any;
    paidOfCustomer: any;
    idCustomer: any;
    objUser: any;
    idUser: any;
    discount: number;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {}
    ngOnInit() {
        this.getCustomer();
    }
    dismiss() {
        this.ref.close({
            pennant: 0,
        });
    }
    async delete() {
        let startDate = moment(this.event.startDay, 'DD/MM/YYYY');
        let currenDate = moment(new Date()).format('DD/MM/YYYY');
        let endDate = moment(currenDate, 'DD/MM/YYYY');
        let diffInDays = startDate.diff(endDate, 'days');
        if (diffInDays < 7) {
            let schelude = Parse.Object.extend('schedule');
            let ObjectSchedule = new schelude();
            const contract = Parse.Object.extend('contract');
            let objContract = new contract();
            let dataSave: any = {};
            let dataSchedule: any = {};
            dataSave.objectId = this.event.id;
            dataSave.status = false;
            dataSave.indemnification = this.event.price;
            try {
                let result = await objContract.save(dataSave);
                if (result) {
                    dataSchedule.empty = await this.contractService.setEmpty(this.event.idSchedule, this.event.tourQuantity);
                    dataSchedule.objectId = this.event.idSchedule;
                    await ObjectSchedule.save(dataSchedule);
                    this.ref.close({
                        pennant: true,
                    });
                }
                // get so tien
            } catch (ex) {
                console.log(ex);
                this.ref.close({
                    pennant: ex,
                });
            }
        } else {
            try {
                let repay = Parse.Object.extend('repay');
                let objRepay = new repay();
                let customer = Parse.Object.extend('customer');
                let objCustomer = new customer();
                const contract = Parse.Object.extend('contract');
                let objContract = new contract();
                const query = new Parse.Query(contract);
                let schedule = Parse.Object.extend('schedule');
                let ObjectSchedule = new schedule();
                let dataCustomer: any = {};
                let dataContract: any = {};
                let dataRepay: any = {};
                let dataSchedule: any = {};
                dataContract.status = false;
                dataContract.objectId = this.event.id;
                let result = await objContract.save(dataContract);
                if (result) {
                    if (this.event.paid > 0) {
                        dataRepay.repay = this.event.paid;
                        dataRepay.objContract = result;
                        dataRepay.status = false;
                        await objRepay.save(dataRepay);
                    }
                    dataSchedule.empty = await this.contractService.setEmpty(this.event.idSchedule, this.event.tourQuantity);
                    dataSchedule.objectId = this.event.idSchedule;
                    await ObjectSchedule.save(dataSchedule);
                    dataCustomer.objectId = this.idCustomer;
                    dataCustomer.paid = this.paidOfCustomer - this.event.price;
                    if (this.paidOfCustomer - this.event.price >= 100000000) {
                        dataCustomer.discount = 0.1;
                    } else {
                        if (this.paidOfCustomer - this.event.price < 100000000 && this.paidOfCustomer - this.event.price >= 50000000)
                            dataCustomer.discount = 0.05;
                        else {
                            dataCustomer.discount = 0;
                        }
                    }
                    await objCustomer.save(dataCustomer);
                    let innerQuery = new Parse.Query(schedule);
                    innerQuery.greaterThanOrEqualTo('startDay', new Date());
                    query.matchesQuery('objSchedule', innerQuery);
                    query.equalTo('status', true);
                    query.equalTo('objUser', result.get('objUser'));
                    let r = await query.find();
                    if (r.length > 0) {
                        for (let data of r) {
                            let obj = await new contract();
                            if (dataCustomer.discount < data.get('discount')) {
                                obj.set('objectId', data.id);
                                obj.set('discount', dataCustomer.discount);
                                await obj.save();
                            }
                        }
                    }
                    this.ref.close({
                        pennant: true,
                    });
                }
            } catch (ex) {
                this.ref.close({
                    pennant: ex,
                });
            }
        }
    }
    async getCustomer() {
        console.log(this.event);
        const custom = Parse.Object.extend('customer');
        const query = new Parse.Query(custom);
        query.select('paid');
        query.equalTo('objUser', this.event.idUser);
        let result = await query.first();
        if (result) {
            this.paidOfCustomer = result.attributes.paid;
            this.idCustomer = result.id;
            this.objUser = result.attributes.objUser;
            this.discount = result.attributes.discount;
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
                <div *ngIf="this.form1">
                    <h6 class="text-danger">Tour đã khởi hành không được xóa!</h6>
                </div>
                <div *ngIf="this.form2">
                    <div>Bạn muốn xóa vé của {{ this.info.name }}</div>
                    <div class="footer">
                        <button class="float-right btn btn-info" (click)="delete()">OK</button>
                        <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                    </div>
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
    pennant: boolean = false;
    idUser: any;
    paidOfCustomer: any;
    idCustomer: any;
    objUser: any;
    discount: number;
    saleoff: number;
    form1: boolean;
    form2: boolean;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService, private tourService: TourService) {}
    ngOnInit() {
        this.getCustomer();
        console.log('ffff');
        if (this.startDay < new Date()) {
            this.form1 = true;
            this.form2 = false;
        } else {
            this.form2 = true;
            this.form1 = false;
        }
    }
    dismiss() {
        this.ref.close();
    }
    async delete() {
        let startDate = moment(this.startDay, 'DD/MM/YYYY');
        let currenDate = moment(new Date()).format('DD/MM/YYYY');
        let endDate = moment(currenDate, 'DD/MM/YYYY');
        let diffInDays = startDate.diff(endDate, 'days');
        if (diffInDays < 7) {
            let objschedule = Parse.Object.extend('schedule');
            let ObjectSchedule = new objschedule();
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
                if (result) {
                    this.info.createAt = new Date();
                    this.cancelTicket.push(this.info);
                    dataSave.objectId = this.idContract;
                    dataSave.infoCustom = this.array;
                    if (this.info.type === 'Người lớn') {
                        dataSave.numberAdult = result.attributes.numberAdult - 1;
                    }
                    if (this.info.type === 'Trẻ em') {
                        dataSave.numberKids = result.attributes.numberKids - 1;
                    }
                    // get so tien
                    let save = await obj.save(dataSave);
                    if (save) {
                        dataTour.empty = await this.contractService.setEmpty(this.idTour, this.quantity);
                        dataTour.objectId = this.idTour;
                        await ObjectSchedule.save(dataTour);
                    }
                    this.ref.close({
                        pennant: true,
                    });
                }
            } catch (ex) {
                throw ex;
            }
        } else {
            let schedule = Parse.Object.extend('schedule');
            let ObjectSchedule = new schedule();
            let customer = Parse.Object.extend('customer');
            let objCustomer = new customer();
            const contract = Parse.Object.extend('contract');
            let obj = new contract();
            const query = new Parse.Query(contract);
            query.equalTo('objectId', this.idContract);
            let dataSave: any = {};
            let dataSchedule: any = {};
            let dataCustomer: any = {};
            try {
                let result = await query.first();
                this.info.createAt = new Date();
                dataSave.objectId = this.idContract;
                dataSave.infoCustom = this.array;
                // get so tien

                let kids =
                    result.attributes.objSchedule.attributes.objTour.attributes.childrenPrice -
                    result.attributes.objSchedule.attributes.objTour.attributes.saleoff;
                let adult =
                    result.attributes.objSchedule.attributes.objTour.attributes.adultPrice -
                    result.attributes.objSchedule.attributes.objTour.attributes.saleoff;
                let price = result.attributes.price;
                if (this.info.type === 'Người lớn') {
                    dataSave.numberAdult = result.attributes.numberAdult - 1;
                    dataSave.price = price - adult;
                }
                if (this.info.type === 'Trẻ em') {
                    dataSave.numberKids = result.attributes.numberKids - 1;
                    dataSave.price = price - kids;
                }
                dataSave.sumFare = result.attributes.sumFare - dataSave.price - dataSave.price * this.discount;
                let save = await obj.save(dataSave);
                if (save) {
                    dataSchedule.empty = await this.contractService.setEmpty(this.idTour, this.quantity);
                    dataSchedule.objectId = this.idTour;
                    await ObjectSchedule.save(dataSchedule);
                    dataCustomer.objectId = this.idCustomer;
                    dataCustomer.objUser = this.idUser;
                    dataCustomer.paid = this.paidOfCustomer + dataSave.price - price;
                    dataCustomer.discount = 0;
                    if (dataCustomer.paid >= 100000000) dataCustomer.discount = 0.1;
                    if (dataCustomer.paid < 100000000 && dataCustomer.paid >= 50000000) dataCustomer.discount = 0.05;

                    await objCustomer.save(dataCustomer);
                    this.pennant = true;
                }
                let innerQuery = new Parse.Query(schedule);
                const query1 = new Parse.Query(contract);
                innerQuery.greaterThanOrEqualTo('startDay', new Date());
                query1.matchesQuery('objSchedule', innerQuery);
                query1.equalTo('status', true);
                query1.equalTo('objUser', result.get('objUser'));
                let r = await query1.find();
                if (r.length > 0) {
                    for (let data of r) {
                        let objContract = await new contract();
                        if (dataCustomer.discount < data.get('discount')) {
                            objContract.set('objectId', data.id);
                            objContract.set('discount', dataCustomer.discount);
                            await objContract.save();
                        }
                    }
                }
                this.ref.close({
                    pennant: this.pennant,
                });
            } catch (ex) {
                throw ex;
            }
        }
    }
    async getCustomer() {
        const custom = Parse.Object.extend('customer');
        const query = new Parse.Query(custom);
        query.select('paid');
        query.equalTo('objUser', this.idUser);
        let result = await query.first();
        if (result) {
            this.paidOfCustomer = result.attributes.paid;
            this.idCustomer = result.id;
            this.objUser = result.attributes.objUser;
            this.discount = result.attributes.discount;
        }
    }
}
