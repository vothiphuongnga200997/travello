import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'date-filter-cmp',
    templateUrl: './date-filter.component.html',
    styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent {
    @Output() timeEmitter: EventEmitter<any> = new EventEmitter();
    commonSelectedItem: any;
    rangepicker: any;

    timeConfig: Array<any> = [
        {
            name: 'today',
            displayName: 'Today',
            value: {
                from: 'now%2Fd',
                to: 'now%2Fd',
            },
        },
        {
            name: 'thisweek',
            displayName: 'This week',
            value: {
                from: 'now%2Fw',
                to: 'now%2Fw',
            },
        },
        {
            name: 'thismonth',
            displayName: 'This month',
            value: {
                from: 'now%2FM',
                to: 'now%2FM',
            },
        },
        {
            name: 'thisyear',
            displayName: 'This year',
            value: {
                from: 'now%2Fy',
                to: 'now%2Fy',
            },
        },
        {
            name: 'todaysofar',
            displayName: 'Today so far',
            value: {
                from: 'now%2Fd',
                to: 'now',
            },
        },
        {
            name: 'weektodate',
            displayName: 'Week to date',
            value: {
                from: 'now%2Fw',
                to: 'now',
            },
        },
        {
            name: 'monthtodate',
            displayName: 'Month to date',
            value: {
                from: 'now%2FM',
                to: 'now',
            },
        },
        {
            name: 'yeartodate',
            displayName: 'Year to date',
            value: {
                from: 'now%2Fy',
                to: 'now',
            },
        },
    ];

    onSelectTimeFilter(event) {
        this.timeEmitter.emit(event);
    }

    onSelecteRangeFilter(event) {
        console.log(event);
    }
}
