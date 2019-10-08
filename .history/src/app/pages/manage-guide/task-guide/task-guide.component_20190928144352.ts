import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { GuideService } from '../../../shared/services/guide.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';

@Component({
    selector: 'ngx-task-guide',
    templateUrl: './task-guide.component.html',
    styleUrls: ['./task-guide.component.scss'],
})
export class TaskGuideComponent implements OnInit {
    title = '';
    id: any;
    source: LocalDataSource = new LocalDataSource();
    flipped = false;
    toggleView() {
        this.flipped = !this.flipped;
    }
    infoTour: Array<any> = [];
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
    constructor(public windowRef: NbWindowRef, public guideService: GuideService) {}

    ngOnInit() {
        if (this.id) {
        }
        this.getTour();
    }
    close() {
        this.windowRef.close();
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
