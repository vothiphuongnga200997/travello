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
        this.id = this.router.snapshot.paramMap.get('id');
    }
    id: any;
    validatingForm: FormGroup;

    ngOnInit() {
        this.getTour();
    }

    async getTour() {
        this.listTour = [];
        const currentDate = new Date(
            moment(Date.now())
                .add(3, 'day')
                .format('LLL'),
        );
        const location = Parse.Object.extend('location');
        const queryLoation = new Parse.Query(location);
        queryLoation.equalTo('objectId', this.id);
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
                listLocation.push({

                });
            }
            querySchedule.equalTo('objTour', data);
            querySchedule.greaterThan('startDay', currentDate);
            querySchedule.greaterThan('empty', 0);
            let resultSchedule = await querySchedule.first();
            if (resultSchedule) {
                this.listTour.push({
                    nameTour: result.get('nameTour'),
                    hightLight: result.get('highlights'),
                    location: 
                });
            }
            console.log('schedule', resultSchedule);
            console.log('tour', data);
        }
    }
}
