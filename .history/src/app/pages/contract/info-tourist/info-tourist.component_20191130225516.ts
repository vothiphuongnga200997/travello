import { Component, OnInit } from '@angular/core';
import { DeleteTicketComponent } from '../delete-customer';
import { NbDialogService } from '@nebular/theme';
import * as Parse from 'parse';
import { ToastrService } from '../../../shared/services';
import { TourService } from '../../../shared/services/tour.service';
import { DeleteComponent } from '../delete-customer';
@Component({
    selector: 'ngx-info-tourist',
    templateUrl: './info-tourist.component.html',
    styleUrls: ['./info-tourist.component.scss'],
})
export class InfoTouristComponent implements OnInit {
    event: any; // id Contract
    status: string;
    data: Array<any> = [];
    user: Array<any> = [];
    idTour: string;
    startDay: any;
    quantity: number;
    idUser: any;
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService, private tourService: TourService) {}

    async ngOnInit() {
        await this.getInfo();
        await this.getUser();
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
            }
        } catch (ex) {
            throw ex;
        }
    }
    async getUser() {
        this.user = [];
        const query = new Parse.Query(Parse.User);
        query.equalTo('objectId', this.idUser.id);
        try {
            let result = await query.find({ useMasterKey: true });
            if (result) {
                console.log(result);
            }
        } catch (ex) {
            throw ex;
        }
    }
    deleteTicket(event, numberTourist) {
        // console.log(event);
        if (this.data.length === 1) {
        }
        this.deleteArray = this.data.slice();
        this.deleteArray.splice(numberTourist, 1);
        console.log(this.deleteArray);
        this.dialogService
            .open(DeleteTicketComponent, {
                context: {
                    title: 'Delete',
                    info: this.data[numberTourist],
                    startDay: this.startDay,
                    array: this.deleteArray,
                    idContract: this.event,
                    idTour: this.idTour,
                    quantity: this.quantity,
                    status: this.status,
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
