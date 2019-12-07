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
    ngOnInit() {}
}
