import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-result-tour',
    templateUrl: './result-tour.component.html',
    styleUrls: ['./result-tour.component.scss'],
})
export class ResultTourComponent implements OnInit, OnDestroy {
    private dataSearchFromHomeComponet: any;

    private subscribeGetSearchParams: any;
    constructor(private router: Router, private activeRoute: ActivatedRoute) {}
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    ngOnInit() {
        this.subscribeGetSearchParams = this.activeRoute.queryParams.subscribe(async params => {
            // Defaults to 0 if no query param provided.
            this.dataSearchFromHomeComponet = params;
            const schedule = Parse.Object.extend('schedule');

            let tour = Parse.Object.extend('tour');
            let innerQueryTour = new Parse.Query(tour);

            const query = new Parse.Query(schedule);
            if (this.dataSearchFromHomeComponet.startDay !== '' || this.dataSearchFromHomeComponet.startDay !== undefined) {
                query.greaterThanOrEqualTo('startDay', this.dataSearchFromHomeComponet.startDay);
            }
            if (this.dataSearchFromHomeComponet.endDay !== '' || this.dataSearchFromHomeComponet.endDay !== undefined) {
                query.greaterThanOrEqualTo('endDay', this.dataSearchFromHomeComponet.startDay);
            }
            if (this.dataSearchFromHomeComponet.location !== '' || this.dataSearchFromHomeComponet.location !== undefined) {
                const location = Parse.Object.extend('location');
                const queryLocation = new Parse.Query(location);
                queryLocation.equalTo('location', this.capital_letter(this.dataSearchFromHomeComponet.location));
                let i = await queryLocation.first();
                if (i) {
                    innerQueryTour.equalTo('locations', i);
                    let resultT = await innerQueryTour.find();
                    console.log(resultT);
                    query.matchesQuery('objTour', innerQueryTour);
                }
            }
            console.log('dataSearchFromHomeComponet ResultTourComponent', this.dataSearchFromHomeComponet);
        });
    }

    ngOnDestroy(): void {
        this.subscribeGetSearchParams.unsubscribe();
    }
}
