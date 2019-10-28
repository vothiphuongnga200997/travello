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
    quantityCustom: Array<any>; // mang theo thang
    constructor(private theme: NbThemeService, private tourService: TourService) {}
    ngOnInit() {}
    async getCustom() {
        const contract = Parse.Object.extend('contract');
        this.quantityCustom = [];
        for (let i = 1; i <= 12; i++) {
            const query = new Parse.Query(contract);
            query.select('date');
            query.notEqualTo('infoCustom', []);
            let end = new Date(2019, i, 0);
            let start = new Date('2019-' + i + '-1');
            query.greaterThanOrEqualTo('date', start);
            query.lessThanOrEqualTo('date', end);
            try {
                let result = await query.count();
                this.quantityCustom[i - 1] = result;
                console.log(this.quantityCustom);
            } catch (ex) {
                throw ex;
            }
        }
    }
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
                if (i.get('startDay') < today && i.get('endDay') > today) this.going++;
                else {
                    if (i.get('endDay') > today) this.pending++;
                }
            }
            this.sum = result.length;

            const colors = config.variables;
            const echarts: any = config.variables.echarts;
            let percentPending = (this.pending * 100) / this.sum;
            let percentGoing = (this.going * 100) / this.sum;
            let percentEnd = (this.end * 100) / this.sum;
            console.log(percentPending, percentGoing, this.sum);
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
                        data: [{ value: percentPending, name: 'Tour chưa khởi hành' }, { value: percentGoing, name: 'Tou đang đi' }],
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

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;
            this.options = {
              backgroundColor: echarts.bg,
              color: [colors.primaryLight],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                },
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
              },
              xAxis: [
                {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                    alignWithLabel: true,
                  },
                  axisLine: {
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                  axisLabel: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLine: {
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                  splitLine: {
                    lineStyle: {
                      color: echarts.splitLineColor,
                    },
                  },
                  axisLabel: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
              ],
              series: [
                {
                  name: 'Score',
                  type: 'bar',
                  barWidth: '60%',
                  data: [10, 52, 200, 334, 390, 330, 220],
                },
              ],
            };
          });
    }
    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}