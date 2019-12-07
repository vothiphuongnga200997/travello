import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { Router } from '@angular/router';
import { NgxCarousel } from 'ngx-carousel';
import { TourService } from '../../shared/services/tour.service';
import * as moment from 'moment';

@Component({
    selector: 'ngx-find',
    templateUrl: './find.component.html',
    styleUrls: ['./home.component.scss'],
})
export class FindComponent implements OnInit {
    location: any;
    startDay: any;
    endDay: any;
    money: any;
    constructor(private router: Router) {}
    ngOnInit() {}
    findTour() {
        let dataWillSendResultTour = { startDay: this.startDay, endDay: this.endDay, money: this.money, location: this.location };
        this.router.navigate(['/resultTour/'], {
            queryParams: dataWillSendResultTour,
        });
    }
}
