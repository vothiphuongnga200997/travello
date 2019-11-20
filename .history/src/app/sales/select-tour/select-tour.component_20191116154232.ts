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
        const location = Parse.Object.extend('location');
        const queryLoation = new Parse.Query(location);
        queryLoation.equalTo('objectId', this.id);
        let objLocation = await queryLoation.first();

        let query = new Parse.Query('tour');
        query.equalTo('locations', objLocation);
        let result = await query.find();
        for (let data of result) {
            let locationRelation = data.relation('locations');
            let resultLocation = locationRelation.query().find();
        }
        console.log(result);
    }
}
