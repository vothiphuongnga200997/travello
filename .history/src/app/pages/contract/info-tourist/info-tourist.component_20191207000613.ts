import { Component, OnInit } from '@angular/core';
import { DeleteTicketComponent, DeleteComponent } from '../delete-customer';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import * as Parse from 'parse';
import { ToastrService } from '../../../shared/services';
import { TourService } from '../../../shared/services/tour.service';
import * as moment from 'moment';
@Component({
    selector: 'ngx-info-tourist',
    templateUrl: './info-tourist.component.html',
    styleUrls: ['./info-tourist.component.scss'],
})
export class InfoTouristComponent implements OnInit {
    title: any;
    idContract: string; // id Contract
    status: string;
    data: Array<any> = [];
    user: Array<any> = [];
    idTour: string;
    startDay: any;
    quantity: number;
    idUser: any;
    event: any;
    constructor(
        protected ref: NbDialogRef<InfoTouristComponent>,
        private dialogService: NbDialogService,
        private toastrService: ToastrService,
        private tourService: TourService,
    ) {}

    ngOnInit() {
        console.log(this.idContract);
        this.getInfo();
    }

    deleteArray: Array<any>;
    async getInfo() {
        this.data = [];
        const contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.include('objTour');
        query.include('objUser');
        query.equalTo('objectId', this.idContract);
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
    dismiss() {
        this.ref.close({
            pennant: 0,
        });
    }

    deleteTicket(numberTourist, i) {
        if (this.data.length === 1) {
            this.dialogService
                .open(DeleteComponent, {
                    context: {
                        title: 'XÓA ',
                        event: this.event,
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        if (data.pennant === true) {
                            this.ref.close({
                                pennant: true,
                            });
                        } else {
                            if (data.pennant !== 1 && data.pennant !== 0) this.toastrService.error(data.pennant, `Delete Error`);
                        }
                    }
                });
        } else {
            this.deleteArray = this.data.slice();
            this.deleteArray.splice(numberTourist, 1);
            console.log(this.deleteArray);
            this.dialogService
                .open(DeleteTicketComponent, {
                    context: {
                        title: 'Delete',
                        info: this.data[i],
                        startDay: this.startDay,
                        array: this.deleteArray,
                        idContract: this.idContract,
                        idTour: this.idTour,
                        quantity: this.quantity,
                        idUser: this.idUser,
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        if (data.pennant) {
                            await this.getInfo();
                            this.toastrService.success(`Delete Success`, 'Delete success');
                        } else {
                            await this.getInfo();
                            this.toastrService.error(`Delete Error`);
                        }
                    }
                });
        }
    }
}
