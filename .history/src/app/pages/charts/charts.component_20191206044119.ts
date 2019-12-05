import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Parse from 'parse';
import { TourService } from '../../shared/services/tour.service';
@Component({
    selector: 'charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
    options: any = {};
    themeSubscription: any;
    sum: number;
    pending: number;
    going: number;
    end: number;
    quantityCustom: Array<any>; // mang theo thang
    constructor(private theme: NbThemeService, private tourService: TourService) {}
    ngOnInit() {}
}
