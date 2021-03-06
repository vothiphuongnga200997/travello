import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements AfterViewInit, OnDestroy {options: any = {};
themeSubscription: any;

constructor(private theme: NbThemeService) {
}

ngAfterViewInit() {
  this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

    const colors = config.variables;
    const echarts: any = config.variables.echarts;

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
            { value: 60, name: 'Germany' },
            { value: 40, name: 'France' },
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
