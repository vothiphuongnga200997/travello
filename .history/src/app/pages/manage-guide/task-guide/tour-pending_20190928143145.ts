import { Component } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ProfitBarAnimationChartData } from '../../../@core/data/profit-bar-animation-chart';

@Component({
    selector: 'ngx-stats-card-back',
    styleUrls: ['./task-guide.component.scss'],
    template: `
        <div></div>
    `,
})
export class StatsCardFrontComponent {
    private alive = true;

    linesData: { firstLine: number[]; secondLine: number[] };

    constructor(private profitBarAnimationChartService: ProfitBarAnimationChartData) {
        this.profitBarAnimationChartService
            .getChartData()
            .pipe(takeWhile(() => this.alive))
            .subscribe(linesData => {
                this.linesData = linesData;
            });
    }
}
