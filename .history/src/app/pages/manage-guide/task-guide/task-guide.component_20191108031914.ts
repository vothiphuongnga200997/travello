import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NbWindowRef, NbWindowService } from '@nebular/theme';
import { GuideService } from '../../../shared/services/guide.service';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import * as moment from 'moment';
import { FilterTourComponent } from '../../manage-tour/filter-tour/filter-tour.component';
@Component({
    moduleId: module.id,
    selector: 'button',
    template: `
        <div class="download">
            <a class="d-flex justify-content-center" style="font-size:25px" (click)="onClick()"><i class="fas fa-info-circle"></i></a>
        </div>
    `,
})
export class ButtonComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}
@Component({
    selector: 'ngx-task-guide',
    templateUrl: './task-guide.component.html',
    styleUrls: ['./task-guide.component.scss'],
})
export class TaskGuideComponent implements OnInit {
    title = '';
    id: any;
    source: LocalDataSource = new LocalDataSource();
    source1: LocalDataSource = new LocalDataSource();

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
                title: 'Mã thời điểm',
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
            itinerary: {
                title: 'Chi tiết',
                type: 'custom',
                renderComponent: ButtonComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {});
                },
                filter: false,
            },
        },
    };
    loading = false;

    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    constructor(public guideService: GuideService) {}

    ngOnInit() {
        this.getTourPeding();
        this.getTourEnd();
    }

    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('HH:mm DD/MM/YYYY');
    }
    async getTourPeding() {
        let i = await this.guideService.getTour(this.id);
        console.log(i);
        if (i && i.length) {
            let dataSourses = i.map(res => {
                return {
                    code: res.get('codeSchedule'),
                    tour: res.attributes.objTour.attributes.nameTour,
                    startDay: this.formatDate(res.get('startDay')),
                    endDay: this.formatDate(res.get('endDay')),
                };
            });
            this.source.load(dataSourses);
        }
    }
    async getTourEnd() {
        let i = await this.guideService.getTourEnd(this.id);
        console.log(i);

        if (i && i.length) {
            let dataSourses = i.map(res => {
                return {
                    id: res.id,
                    code: res.get('codeSchedule'),
                    tour: res.attributes.objTour.attributes.nameTour,
                    startDay: this.formatDate(res.get('startDay')),
                    endDay: this.formatDate(res.get('endDay')),
                };
            });
            this.source1.load(dataSourses);
        }
    }
    // openFilter(id) {
    //     this.windowService
    //         .open(FilterTourComponent, {
    //             title: `Lọc tour`,
    //             context: {
    //                 objSchedule: id,
    //             },
    //         })
    //         .onClose.subscribe();
    // }
}
