import { Component, AfterViewInit, OnDestroy } from '@angular/core';
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
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
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
                                    return (
                                        'Precipitation  ' +
                                        params.value +
                                        (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                                    );
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
                        name: '2016 Precipitation',
                        type: 'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7],
                    },
                    {
                        name: '2016 Precipitation',
                        type: 'line',
                        smooth: true,
                        data: [5, 7, 20, 18.7, 48.3, 69.2, 8, 8, 55.4, 7, 30, 0.7],
                    },
                ],
            };
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
