import { Component, OnInit } from '@angular/core';
import { WatchInfoService } from '../../shared/services/watch-info-service';

@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit {
    pending: Array<any>;
    end: Array<any>;
    constructor(private watchInfoService: WatchInfoService) {}
    ngOnInit() {}

    async getContract() {
        this.pending = [];
        this.end = [];
        let today = new Date();
        let result = await this.watchInfoService.getContrat('70vrTOFUHt');
        for (let i of result) {
            if (i.attributes.objTour.attributes.startDay < today) {
                this.pending.push({
                    id: i.id,
                    create: i.attributes.createdAt,
                    deposit: i.attributes.deposit,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    idTour: i.attributes.objTour.id,
                    departure: i.attributes.objTour.attributes.departure,
                    duration: i.attributes.objTour.attributes.duration,
                    endDay: i.attributes.objTour.attributes.endDay,
                    startDay: i.attributes.objTour.attributes.startDay,
                    vehicle: i.attributes.objTour.attributes.vehicle,
                    hotel: i.attributes.objTour.attributes.hotel,
                });
            } else {
                this.end.push({
                    id: i.id,
                    create: i.attributes.createdAt,
                    deposit: i.attributes.deposit,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    idTour: i.attributes.objTour.id,
                    departure: i.attributes.objTour.attributes.departure,
                    duration: i.attributes.objTour.attributes.duration,
                    endDay: i.attributes.objTour.attributes.endDay,
                    startDay: i.attributes.objTour.attributes.startDay,
                    vehicle: i.attributes.objTour.attributes.vehicle,
                    hotel: i.attributes.objTour.attributes.hotel,
                });
            }
        }
        console.log(result);
    }
}
