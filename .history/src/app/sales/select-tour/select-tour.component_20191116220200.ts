import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import * as Parse from 'parse';
import * as moment from 'moment';
@Component({
    selector: 'ngx-select-tour',
    templateUrl: './select-tour.component.html',
    styleUrls: ['./select-tour.component.scss'],
})
export class SelectTourComponent implements OnInit {
    listTour: Array<any>;

    constructor(private router: ActivatedRoute) {
        this.getTour();
    }
    id: any;
    validatingForm: FormGroup;

    ngOnInit() {}

    async getTour() {
        this.listTour = [];
        const currentDate = new Date(
            moment(Date.now())
                .add(3, 'day')
                .format('LLL'),
        );
        const location = Parse.Object.extend('location');
        const queryLoation = new Parse.Query(location);
        queryLoation.equalTo('objectId', this.router.snapshot.paramMap.get('id'));
        let objLocation = await queryLoation.first();

        let query = new Parse.Query('tour');
        query.equalTo('locations', objLocation);

        let querySchedule = new Parse.Query('schedule');
        let result = await query.find();
        for (let data of result) {
            let locationRelation = data.relation('locations');
            let resultLocation = await locationRelation.query().find();
            let listLocation = [];
            for (let dataLocation of resultLocation) {
                await listLocation.push(dataLocation.get('location'));
            }
            querySchedule.equalTo('objTour', data);
            querySchedule.greaterThan('startDay', currentDate);
            querySchedule.greaterThan('empty', 0);
            let resultSchedule = await querySchedule.first();
            if (resultSchedule !== undefined) {
                this.listTour.push({
                    nameTour: data.get('nameTour'),
                    hightLight: data.get('highlights'),
                    location: listLocation,
                });
            }
        }
        console.log(this.listTour);
    }
}
