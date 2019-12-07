import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import * as moment from 'moment';

@Component({
    selector: 'ngx-result-tour',
    templateUrl: './result-tour.component.html',
    styleUrls: ['./result-tour.component.scss'],
})
export class ResultTourComponent implements OnInit, OnDestroy {
    private dataSearchFromHomeComponet: any;
    listTour: Array<any>;
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
            console.log('dataSearchFromHomeComponet ResultTourComponent', this.dataSearchFromHomeComponet);

            const schedule = Parse.Object.extend('schedule');
            const query = new Parse.Query(schedule);

            let tour = Parse.Object.extend('tour');
            let innerQueryTour = new Parse.Query(tour);

            if (this.dataSearchFromHomeComponet.startDay !== undefined) {
                query.greaterThanOrEqualTo('startDay', new Date(this.dataSearchFromHomeComponet.startDay));
            }
            if (this.dataSearchFromHomeComponet.endDay !== undefined) {
                query.greaterThanOrEqualTo('endDay', new Date(this.dataSearchFromHomeComponet.startDay));
            }
            if (this.dataSearchFromHomeComponet.location !== '') {
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
            if (this.dataSearchFromHomeComponet.money !== '') {
                if (this.dataSearchFromHomeComponet.money === 1) {
                    query.greaterThanOrEqualTo('adulPrice', 1000000);
                    query.lessThanOrEqualTo('adultPrice', 5000000);
                }
                if (this.dataSearchFromHomeComponet.money === 2) {
                    query.greaterThanOrEqualTo('adulPrice', 5000000);
                    query.lessThanOrEqualTo('adultPrice', 8000000);
                }
                if (this.dataSearchFromHomeComponet.money === 3) {
                    query.greaterThanOrEqualTo('adulPrice', 8000000);
                    query.lessThanOrEqualTo('adultPrice', 10000000);
                }
                if (this.dataSearchFromHomeComponet.money === 4) {
                    query.greaterThan('adultPrice', 10000000);
                }
            }
            query.greaterThanOrEqualTo('startDay', new Date());
            let result = await query.find();
            if (result) {
                this.listTour = [];
                for (let data of result) {
                    let queryImg = new Parse.Query('imagesTour');

                    let locationRelation = data.relation('locations');
                    let resultLocation = await locationRelation.query().find();
                    let listLocation = [];
                    for (let dataLocation of resultLocation) {
                        await listLocation.push(dataLocation.get('location'));
                    }
                    let resultImg = await queryImg.first();

                    this.listTour.push({
                        id: data.id,
                        nameTour: data.get('objTour').get('nameTour'),
                        hightLight: data.get('objTour').get('highlights'),
                        location: listLocation,
                        image: resultImg.attributes.image._url,
                        vehicle: data.get('objTour').get('vehicle'),
                        duration: data.get('objTour').get('duration'),
                        departure: data.get('objTour').get('departure'),
                        saleoff: data.get('saleoff'),
                        adultPrice: data.get('objTour').get('adultPrice') - data.get('objTour').get('saleoff'),
                        startDay: moment(data.get('startDay')).format('DD/MM/YYYY'),
                        endDay: moment(data.get('endDay')).format('DD/MM/YYYY'),
                        specical: data.get('objTour').get('specical'),
                    });
                }
                console.log(this.listTour);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscribeGetSearchParams.unsubscribe();
    }
}
