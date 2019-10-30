import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup} from '@angular/forms';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-select-tour',
    templateUrl: './select-tour.component.html',
    styleUrls: ['./select-tour.component.scss'],
})
export class SelectTourComponent implements OnInit {
    constructor(private router: ActivatedRoute) {}
    id: any;
    validatingForm: FormGroup;

    ngOnInit() {
        this.id = this.router.snapshot.paramMap.get('id');
        console.log(this.id);
    }

    async getTour() {
        let tour = Parse.Object.extend('tour');
        let relation = tour.relation('locations');
        let query = relation.query();
        query.equalTo('objectId', this.id);
        let result =  await query.find();
        console.log(result);
}
