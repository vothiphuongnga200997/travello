import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { StatsBarData } from '../../../@core/data/stats-bar';

@Component({
    selector: 'ngx-stats-card-back',
    styleUrls: ['./task-guide.component.scss'],
    template: `
        <div></div>
    `,
})
export class StatsCardBackComponent implements OnDestroy {
    private alive = true;

    chartData: number[];

    constructor(private statsBarData: StatsBarData) {
        this.statsBarData
            .getStatsBarData()
            .pipe(takeWhile(() => this.alive))
            .subscribe(data => {
                this.chartData = data;
            });
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
