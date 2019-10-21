import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Parse from 'parse';
import { TourService } from '../../shared/services/tour.service';
import * as moment from 'moment';

@Component({
    selector: 'charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements AfterViewInit, OnDestroy, OnInit {
    options: any = {};
    themeSubscription: any;
    sum: number;
    pending: number;
    going: number;
    end: number;

    constructor(private theme: NbThemeService, private tourService: TourService) {
        this.getTour();
    }
    ngOnInit() {}
    ngAfterViewInit() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(async config => {
            this.pending = 0;
            this.end = 0;
            this.going = 0;
            let tour = Parse.Object.extend('tour');
            let today = new Date();
            console.log(today);
            const query = new Parse.Query(tour);
            query.descending('createdAt');
            query.select('startDay', 'endDay');
            let result = await query.find();
            for (let i of result) {
                if (i.get('startDay') > today && i.get('endDay') > today) this.end++;
                else {
                    if (i.get('startDay') < today && i.get('endDay') < today) this.pending++;
                    else {
                        this.going++;
                    }
                }
            }
            this.sum = this.end + this.pending + this.going;
            const colors = config.variables;
            const echarts: any = config.variables.echarts;
            let percentPending = (this.pending * 100) / this.sum;
            let percentGoing = (this.going * 100) / this.sum;
            let percentEnd = (this.end * 100) / this.sum;
            console.log(percentPending, percentGoing, percentEnd);
            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['USA', 'Germany', 'France', 'Canada', 'Russia'],
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                series: [
                    {
                        name: 'Countries',
                        type: 'pie',
                        radius: '80%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 2, name: 'Tour chưa khởi hành' },
                            { value: 3, name: 'Tou đang đi' },
                            { value: 5, name: 'Tou đã kết thúc' },
                            // { value: 234, name: 'Canada' },
                            // { value: 135, name: 'Russia' },
                            // { value: 1548, name: 'USA' },
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: echarts.itemHoverShadowColor,
                            },
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    color: echarts.textColor,
                                },
                            },
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: echarts.axisLineColor,
                                },
                            },
                        },
                    },
                ],
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
