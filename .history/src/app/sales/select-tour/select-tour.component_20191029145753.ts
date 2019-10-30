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

        let tour = new Parse.Object('tour');
        let relation = tour.relation('locations');
        let query = relation.query();

        const location = Parse.Object.extend('location');
        const queryLoation = new Parse.Query(location);
        queryLoation.equalTo('objectId', this.id);
        let objLocation = await queryLoation.first();

        query.equalTo('locations', objLocation);
        query.include('locations');
        query.greaterThan('endDay', currentDate);

        let bookQuery = new Parse.Query('tour');

        bookQuery.equalTo('locations', objLocation);

        bookQuery.include('locations');
        let result = await bookQuery.find();
        console.log(result);

        // execute the query
        const books = await bookQuery.find();
    }
}
