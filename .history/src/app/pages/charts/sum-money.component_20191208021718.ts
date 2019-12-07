import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as Parse from 'parse';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-echarts-multiple-xaxis',
    template: `
        <div style="height: 200px; background: white">
            <table class="table table-striped" style="font-size: 12px">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col" class="text-info">Tháng 1</th>
                        <th scope="col" class="text-info">Tháng 2</th>
                        <th scope="col" class="text-info">Tháng 3</th>
                        <th scope="col" class="text-info">Tháng 4</th>
                        <th scope="col" class="text-info">Tháng 5</th>
                        <th scope="col" class="text-info">Tháng 6</th>
                        <th scope="col" class="text-info">Tháng 7</th>
                        <th scope="col" class="text-info">Tháng 8</th>
                        <th scope="col" class="text-info">Tháng 9</th>
                        <th scope="col" class="text-info">Tháng 10</th>
                        <th scope="col" class="text-info">Tháng 11</th>
                        <th scope="col" class="text-info">Tháng 12</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" class="text-info">Chi</th>
                        <th *ngFor="let chi of this.chi; index as i">{{ chi | number }}đ</th>
                    </tr>
                    <tr>
                        <th scope="row" class="text-info">Thu</th>
                        <th *ngFor="let thu of this.thu; index as i">{{ thu | number }}đ</th>
                    </tr>
                </tbody>
            </table>
            <nb-select style="width: 50%;  margin: 10px ; float: right;" name="platForm" [(selected)]="commonSelectedItem">
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
            const tourCost = Parse.Object.extend('tourCost');

            this.thu = [];
            this.chi = [];
            for (let i = 1; i <= 12; i++) {
                const queryContract = new Parse.Query(contract);

                let end = new Date(this.commonSelectedItem, i, 0);
                let start = new Date(`${this.commonSelectedItem}-` + i + '-1');
                queryContract.greaterThanOrEqualTo('date', start);
                queryContract.lessThanOrEqualTo('date', end);
                queryContract.equalTo('status', true);
                let resultContract = await queryContract.find();
                if (resultContract.length > 0) {
                    let sum = 0;
                    for (let data of resultContract) {
                        sum += data.get('paid');
                        this.thu[i - 1] = sum;
                    }
                } else {
                    this.thu[i - 1] = 0;
                }
                const querySchedule = new Parse.Query(schedule);
                const queryTourCost = new Parse.Query(tourCost);
                querySchedule.greaterThanOrEqualTo('endDay', start);
                querySchedule.lessThanOrEqualTo('endDay', end);
                let resultSchedule = await querySchedule.find();
                let container = [];
                for (let data of resultSchedule) {
                    container.push(data);
                }
                queryTourCost.containedIn('objSchedule', container);
                let resultCost = await queryTourCost.find();
                let sumChi = 0;
                console.log(resultCost);
                for (let data of resultCost) {
                    for (let money of data.get('cost')) {
                        sumChi += money.money;
                    }
                }
                this.chi[i - 1] = sumChi;
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
                        data: this.thu,
                        color: colors.primaryLight,
                    },
                    {
                        name: 'Chi',
                        type: 'line',
                        smooth: true,
                        data: this.chi,
                        color: colors.dangerLight,
                    },
                ],
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
