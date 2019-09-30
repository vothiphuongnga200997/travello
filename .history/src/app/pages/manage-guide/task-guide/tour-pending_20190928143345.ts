import { Component } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ProfitBarAnimationChartData } from '../../../@core/data/profit-bar-animation-chart';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { GuideService } from '../../../shared/services/guide.service';

@Component({
    selector: 'ngx-stats-card-back',
    styleUrls: ['./task-guide.component.scss'],
    template: `
        <div></div>
    `,
})
export class StatsCardFrontComponent {
    private alive = true;
    source: LocalDataSource = new LocalDataSource();

    settings = {
        actions: {
            add: false,
            edit: false,
            delete: false,
        },

        columns: {
            tour: {
                title: 'Tour',
                type: 'string',
                editable: true,
            },
            code: {
                title: 'Ngày sinh',
                type: 'datetime',
                editable: true,
            },
            startDay: {
                title: 'Ngày đi',
                type: 'date',
                editable: true,
            },
            endDay: {
                title: 'Ngày về',
                type: 'date',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'number',
                editable: true,
            },
        },
    };
    linesData: { firstLine: number[]; secondLine: number[] };

    constructor(private profitBarAnimationChartService: ProfitBarAnimationChartData, private guideService: GuideService) {
        this.profitBarAnimationChartService
            .getChartData()
            .pipe(takeWhile(() => this.alive))
            .subscribe(linesData => {
                this.linesData = linesData;
            });
    }

    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('HH:mm DD/MM/YYYY');
    }
    async getTour() {
        let i = await this.guideService.getTour(this.id);
        if (i && i.length) {
            let dataSourses = i.map(res => {
                return {
                    code: res.get('code'),
                    tour: res.get('nameTour'),
                    startDay: this.formatDate(res.get('startDay')),
                    endDay: this.formatDate(res.get('endDay')),
                };
            });
            this.source.load(dataSourses);
        }
    }
}
