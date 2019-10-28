import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-echarts-bar',
    template: `
        <div echarts [options]="options" class="echart"></div>
    `,
})
export class CountMonthComponent implements AfterViewInit, OnDestroy {
    options: any = {};
    themeSubscription: any;
    quantityCustom: Array<any>; // mang theo thang

    constructor(private theme: NbThemeService) {}

    async ngAfterViewInit() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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

                let result = await query.count();
                this.quantityCustom[i - 1] = result;
                console.log(this.quantityCustom);
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
                        name: 'Score',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.quantityCustom,
                    },
                ],
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
