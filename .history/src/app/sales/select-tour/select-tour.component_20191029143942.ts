import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import * as Parse from 'parse';
import { TouchSequence } from 'selenium-webdriver';

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
        const currentDate = new Date();

        let tour = Parse.Object.extend('tour');
        let query = new Parse.Query(tour);

        const location = Parse.Object.extend('location');
        const queryLoation = new Parse.Query(location);
        queryLoation.equalTo('objectId', this.id);
        let objLocation = await queryLoation.first();

        query.equalTo('locations', objLocation);
        query.include('locations');
        query.greaterThan('endDay', currentDate);
        let result = await query.find();
        console.log(result);
    }
}
