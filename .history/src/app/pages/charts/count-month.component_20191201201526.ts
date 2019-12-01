import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-echarts-bar',
    template: `
        <nb-select style="width: 100%" name="platForm" placeholder="Chọn khu vực">
            <nb-option for="let i = 2019 ; i < =2090; i ++" value="i"> nga</nb-option>
        </nb-select>
        <div echarts [options]="options" class="echart"></div>
    `,
})
export class CountMonthComponent implements AfterViewInit, OnDestroy {
    options: any = {};
    themeSubscription: any;
    quantityCustom: Array<any>; // mang theo thang
    quantityCustomCancel: Array<any>; // mang theo thang
    listYear: Array<any> = [];
    constructor(private theme: NbThemeService) {}
    year() {
        for (let i = 2019; i <= 2500; i++) {}
    }

    ngAfterViewInit() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(async config => {
            const contract = Parse.Object.extend('contract');
            this.quantityCustom = [];
            this.quantityCustomCancel = [];

            for (let i = 1; i <= 12; i++) {
                const query = new Parse.Query(contract);
                query.select('date');
                query.equalTo('status', true);
                let end = new Date(2019, i, 0);
                let start = new Date('2019-' + i + '-1');
                query.greaterThanOrEqualTo('date', start);
                query.lessThanOrEqualTo('date', end);

                let result = await query.count();
                this.quantityCustom[i - 1] = result;
            }
            for (let i = 1; i <= 12; i++) {
                const query = new Parse.Query(contract);
                query.select('date');
                query.equalTo('status', false);
                let end = new Date(2019, i, 0);
                let start = new Date('2019-' + i + '-1');
                query.greaterThanOrEqualTo('date', start);
                query.lessThanOrEqualTo('date', end);

                let result = await query.count();
                this.quantityCustomCancel[i - 1] = result;
            }
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
                        name: 'Đã đặt',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.quantityCustom,
                        color: colors.primaryLight,
                    },
                    {
                        name: 'Đã hủy',
                        type: 'bar',
                        barWidth: '20%',
                        data: this.quantityCustomCancel,
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
