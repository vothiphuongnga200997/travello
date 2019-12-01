import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as Parse from 'parse';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-echarts-multiple-xaxis',
    template: `
        <div style="height: 200px; background: white">
            <nb-select style="width: 50% margin: 10px" name="platForm" [(selected)]="commonSelectedItem">
                <nb-option *ngFor="let i of this.listYear" [value]="i">{{ i }}</nb-option>
            </nb-select>
        </div>
        <div echarts [options]="options" class="echart"></div>
    `,
})
export class SumMoneyComponent implements AfterViewInit, OnDestroy {
    options: any = {};
    themeSubscription: any;
    listYear: Array<any> = [];
    commonSelectedItem: any;
    thu: Array<any>; // mang theo thang
    chi: Array<any>; // mang theo thang
    constructor(private theme: NbThemeService) {
        this.year();
        this.commonSelectedItem = 2019;
    }
    year() {
        this.listYear = [];
        for (let i = 2019; i <= 2500; i++) {
            this.listYear.push(i);
        }
    }

    ngAfterViewInit() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(async config => {
            const schedule = Parse.Object.extend('schedule');
            const contract = Parse.Object.extend('contract');
            this.thu = [];
            this.chi = [];
            for (let i = 1; i <= 12; i++) {
                const query = new Parse.Query(schedule);
                const queryContract = new Parse.Query(contract);
                query.select('startDay', 'endDay');
                query.equalTo('status', true);
                let end = new Date(this.commonSelectedItem, i, 0);
                let start = new Date(`${this.commonSelectedItem}-` + i + '-1');
                query.greaterThanOrEqualTo('startDay', start);
                query.lessThanOrEqualTo('startDay', end);

                let result = await query.find();
                console.log(result);
                queryContract.containedIn('objSchedule', result);
                let resultContract = await queryContract.find();
                console.log(resultContract);
                if (resultContract.length > 0) {
                    let sum = 0;
                    for (let data of resultContract.get('sumFare')) {
                        this.thu[i - 1] = sum;
                    }
                }
                this.thu[i - 1] = result;
            }
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;
            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.success, colors.info],
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross',
                    },
                },
                grid: {
                    top: 70,
                    bottom: 50,
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors.info,
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                        axisPointer: {
                            label: {
                                formatter: params => {
                                    return params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                },
                            },
                        },
                        data: [
                            'Tháng 1',
                            'Tháng 2',
                            'Tháng 3',
                            'Tháng 4',
                            'Tháng 5',
                            'Tháng 6',
                            'Tháng 7',
                            'Tháng 8',
                            'Tháng 9',
                            'Tháng 10',
                            'Tháng 11',
                            'Tháng 12',
                        ],
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
                        name: 'Thu',
                        type: 'line',
                        smooth: true,
                        data: [300000, 300000, 10000000, 300000, 7000000, 300000, 800000, 300000, 500000, 100000, 10000000, 7000000],
                        color: colors.primaryLight,
                    },
                    // {
                    //     name: 'Chi',
                    //     type: 'line',
                    //     smooth: true,
                    //     data: [5, 7, 20, 18.7, 48.3, 69.2, 8, 8, 55.4, 7, 30, 0.7],
                    //     color: colors.dangerLight,
                    // },
                ],
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
