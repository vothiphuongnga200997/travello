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
    constructor(private watchInfoService: WatchInfoService, private route: ActivatedRoute) {
        this.idURL = this.route.snapshot.paramMap.get('id');
        this.getContract();
    }
    ngOnInit() {}

    async getContract() {
        this.pending = [];
        this.end = [];
        let today = new Date();
        let result = await this.watchInfoService.getContrat(this.idURL);
        console.log(result);
        for (let i of result) {
            let schedule = Parse.Object.extend('schedule');
            const querySchedule = new Parse.Query(schedule);
            querySchedule.equalTo('objectId', i.get('objSchedule').id);
            querySchedule.include('objTour');
            querySchedule.select('objTour');
            let resultShedule = await querySchedule.first();
            console.log(resultShedule);

            if (resultShedule.attributes.startDay < today) {
                this.pending.push({
                    id: i.id,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    idShedule: resultShedule.id,
                    codeSchedule: resultShedule.attributes.codeSchedule,
                    departure: i.attributes.objTour.attributes.departure,
                    duration: i.attributes.objTour.attributes.duration,
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
                    departure: i.attributes.objTour.attributes.departure,
                    duration: i.attributes.objTour.attributes.duration,
                    endDay: moment(resultShedule.attributes.endDay).format('DD/MM/YYYY, hh:mm A'),
                    startDay: moment(resultShedule.attributes.startDay).format('DD/MM/YYYY, hh:mm A'),
                    daySet: moment(i.attributes.date).format('DD/MM/YYYY, hh:mm A'),
                    hotel: resultShedule.attributes.hotel,
                    vehicle: resultShedule.attributes.objTour.attributes.vehicle,
                    nameTour: resultShedule.attributes.objTour.attributes.nameTour,
                });
            }
        }
        console.log(this.pending);
        console.log(this.end);
    }
}
