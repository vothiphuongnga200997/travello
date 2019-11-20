import { Component, OnInit } from '@angular/core';
import { WatchInfoService } from '../../shared/services/watch-info-service';
import { ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import * as moment from 'moment';

@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit {
    pending: Array<any>;
    end: Array<any>;
    idURL: string;
    form1: boolean = true;
    form2: boolean = false;
    form3: boolean = false;
    fullname: string;
    phone: string;
    email: string;
    type: string;
    disabled: boolean;
    constructor(private watchInfoService: WatchInfoService, private route: ActivatedRoute) {
        this.idURL = this.route.snapshot.paramMap.get('id');
        this.getContract();
        this.submit1();
    }
    ngOnInit() {}

    async getContract() {
        this.pending = [];
        this.end = [];
        let today = new Date();
        let result = await this.watchInfoService.getContrat(this.idURL);
        for (let i of result) {
            let schedule = Parse.Object.extend('schedule');
            const querySchedule = new Parse.Query(schedule);
            querySchedule.equalTo('objectId', i.get('objSchedule').id);
            querySchedule.include('objTour');
            querySchedule.select('objTour');
            let resultShedule = await querySchedule.first();

            if (resultShedule.attributes.startDay > today) {
                this.pending.push({
                    id: i.id,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    idShedule: resultShedule.id,
                    codeSchedule: resultShedule.attributes.codeSchedule,
                    departure: resultShedule.attributes.objTour.attributes.departure,
                    duration: resultShedule.attributes.objTour.attributes.duration,
                    endDay: moment(resultShedule.attributes.endDay).format('DD/MM/YYYY, hh:mm A'),
                    startDay: moment(resultShedule.attributes.startDay).format('DD/MM/YYYY, hh:mm A'),
                    daySet: moment(i.attributes.date).format('DD/MM/YYYY, hh:mm A'),
                    hotel: resultShedule.attributes.hotel,
                    vehicle: resultShedule.attributes.objTour.attributes.vehicle,
                    nameTour: resultShedule.attributes.objTour.attributes.nameTour,
                });
            } else {
                this.end.push({
                    id: i.id,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    idShedule: resultShedule.id,
                    codeSchedule: resultShedule.attributes.codeSchedule,
                    departure: resultShedule.attributes.objTour.attributes.departure,
                    duration: resultShedule.attributes.objTour.attributes.duration,
                    endDay: moment(resultShedule.attributes.endDay).format('DD/MM/YYYY, hh:mm A'),
                    startDay: moment(resultShedule.attributes.startDay).format('DD/MM/YYYY, hh:mm A'),
                    daySet: moment(i.attributes.date).format('DD/MM/YYYY, hh:mm A'),
                    hotel: resultShedule.attributes.hotel,
                    vehicle: resultShedule.attributes.objTour.attributes.vehicle,
                    nameTour: resultShedule.attributes.objTour.attributes.nameTour,
                });
            }
        }
    }
    async editInfo() {}
    async submit1() {
        this.disabled = false;
        this.form1 = true;
        this.form2 = false;
        this.form3 = false;
        let result = await Parse.User.current();
        if (result) {
            this.fullname = result.get('fullname');
            this.email = result.get('email');
            this.phone = result.get('phone');
            if (result.get('moneyPaid') >= 100000000) this.type = 'Khách hàng VIP';
            else {
                if (result.get('moneyPaid') >= 50000000 && result.get('moneyPaid') < 100000000) this.type = 'Khách hàng thân thiện';
                else {
                    this.type = '';
                }
            }
        }
        console.log(result);
    }
    submit2() {
        this.form1 = false;
        this.form2 = true;
        this.form3 = false;
    }
    submit3() {
        this.form1 = false;
        this.form2 = false;
        this.form3 = true;
    }
}
