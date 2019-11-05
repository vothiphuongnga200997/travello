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
                <div>Bạn muốn xóa hợp đồng {{ this.event.data.id }}</div>
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
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {
        this.getCustomer();
    }
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        let dataCustomer: any = {};
        console.log(this.event);
        // let startDate = moment(this.event.data.startDay, 'DD/MM/YYYY');
        // let currenDate = moment(new Date()).format('DD/MM/YYYY');
        // let endDate = moment(currenDate, 'DD/MM/YYYY');
        // let diffInDays = startDate.diff(endDate, 'days');
        // if ((diffInDays < 7 && diffInDays >= 0) || this.event.data.status === 'done') {
        //     let schelude = Parse.Object.extend('schelude');
        //     let ObjectSchedule = new schelude();
        //     const contract = Parse.Object.extend('contract');
        //     let obj = new contract();
        //     const query = new Parse.Query(contract);
        //     let customer = Parse.Object.extend('customer');
        //     let objCustomer = new customer();
        //     query.equalTo('objectId', this.event.data.id);
        //     let dataSave: any = {};
        //     let dataTour: any = {};
        //     this.event.data.tourist.createAt = new Date();
        //     dataSave.objectId = this.event.data.id;
        //     dataSave.infoCustom = [];
        //     dataSave.cancelContract = this.event.data.tourist;
        //     dataSave.numberAdult = 0;
        //     dataSave.numberKids = 0;
        //     dataSave.indemnification = this.event.data.price / 2;

        //     try {
        //         let result = await obj.save(dataSave);
        //         if (result) {
        //             dataTour.empty = await this.contractService.setEmpty(this.event.data.idTour, this.event.data.tourQuantity);
        //             dataTour.objectId = this.event.data.idTour;
        //             await ObjectSchedule.save(dataTour);

        //             this.ref.close({
        //                 pennant: true,
        //             });
        //         }
        //         // get so tien
        //     } catch (ex) {
        //         this.ref.close({
        //             pennant: ex,
        //         });
        //     }
        // } else {
        //     const contract = Parse.Object.extend('contract');
        //     const query = new Parse.Query(contract);
        //     let tour = Parse.Object.extend('tour');
        //     let ObjectTour = new tour();
        //     let dataTour: any = {};
        //     query.equalTo('objectId', this.event.data.id);
        //     try {
        //         let result = await query.first();
        //         console.log(result);
        //         let deleteC = await result.destroy();
        //         if (deleteC) {
        //             dataTour.objectId = this.event.data.idTour;
        //             dataTour.empty = await this.contractService.setEmpty(this.event.data.idTour, this.event.data.tourQuantity);
        //             let objTour = await ObjectTour.save(dataTour);
        //             this.ref.close({
        //                 pennant: true,
        //             });
        //         }
        //     } catch (ex) {
        //         this.ref.close({
        //             pennant: ex,
        //         });
        //     }
        // }
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
    pennant: boolean = false;
    status: string;
    idUser: any;
    paidOfCustomer: any;
    idCustomer: any;
    objUser: any;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService, private tourService: TourService) {}
    ngOnInit() {
        this.getCustomer();
        console.log('ffff');
    }
    dismiss() {
        this.ref.close();
    }
    async delete() {
        let startDate = moment(this.startDay, 'DD/MM/YYYY');
        let currenDate = moment(new Date()).format('DD/MM/YYYY');
        let endDate = moment(currenDate, 'DD/MM/YYYY');
        let diffInDays = startDate.diff(endDate, 'days');
        if ((diffInDays < 7 && diffInDays >= 0) || this.status) {
            let objschedule = Parse.Object.extend('schedule');
            let ObjectSchedule = new objschedule();
            let customer = Parse.Object.extend('customer');
            let objCustomer = new customer();
            const contract = Parse.Object.extend('contract');
            let obj = new contract();
            const query = new Parse.Query(contract);
            query.equalTo('objectId', this.idContract);
            let dataSave: any = {};
            let dataTour: any = {};
            let dataCustomer: any = {};

            try {
                let result = await query.first();
                if (result.attributes.cancelTicket) {
                    this.cancelTicket = result.attributes.cancelTicket;
                }
                if (result) {
                    let schedule = await this.tourService.querySchedule(result.get('objSchedule').id);
                    this.info.createAt = new Date();
                    this.cancelTicket.push(this.info);
                    dataSave.cancelTicket = this.cancelTicket;
                    dataSave.objectId = this.idContract;
                    dataSave.infoCustom = this.array;
                    // get so tien
                    let kids = schedule.attributes.objTour.attributes.childrenPrice;
                    let adult = schedule.attributes.objTour.attributes.adultPrice - schedule.attributes.objTour.attributes.saleoff;
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
                        await ObjectSchedule.save(dataTour);
                        dataCustomer.objectId = this.idCustomer;
                        dataCustomer.objUser = this.idUser;
                        dataCustomer.paid = this.paidOfCustomer + dataSave.price - price;
                        await objCustomer.save(dataCustomer);
                    }
                    this.ref.close({
                        pennant: true,
                    });
                }
            } catch (ex) {
                throw ex;
            }
        } else {
            let tour = Parse.Object.extend('tour');
            let ObjectTour = new tour();
            let customer = Parse.Object.extend('customer');
            let objCustomer = new customer();
            const contract = Parse.Object.extend('contract');
            let obj = new contract();
            const query = new Parse.Query(contract);
            query.equalTo('objectId', this.idContract);
            let dataSave: any = {};
            let dataTour: any = {};
            let dataCustomer: any = {};
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
                    await ObjectTour.save(dataTour);
                    dataCustomer.objectId = this.idCustomer;
                    dataCustomer.objUser = this.idUser;
                    dataCustomer.paid = this.paidOfCustomer + dataSave.price - price;
                    await objCustomer.save(dataCustomer);
                    this.pennant = true;
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
        }
    }
}
