import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { SafeResourceUrl } from '@angular/platform-browser';
@Component({
    moduleId: module.id,
    selector: 'button-view',
    template: `
        <div class="download">
            <a class="d-flex justify-content-center" (click)="onClick()"><i class="fas fa-download"></i></a>
        </div>
    `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
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
    selector: 'ngx-qly-dia-diem',
    templateUrl: './qly-dia-diem.component.html',
    styleUrls: ['./qly-dia-diem.component.scss'],
})
export class QlyDiaDiemComponent implements OnInit {
    generalSource: SafeResourceUrl;

    robotSource: SafeResourceUrl;
    metricSource: SafeResourceUrl;
    statisticsSource: SafeResourceUrl;
    settings = {
        // actions: {
        //      add: false,
        // },
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        columns: {
            id: {
                title: 'ID',
                type: 'string',
                editable: false,
            },
            name: {
                title: 'Tên Tour',
                type: 'string',
                editable: true,
            },
            date: {
                title: 'Trạng thái',
                type: 'string',
                editable: true,
            },
            location: {
                title: 'Địa điễm',
                type: 'string',
                editable: true,
            },
            startDay: {
                title: 'Ngày khởi hành',
                type: 'date',
                editable: true,
            },
            endDay: {
                title: 'Ngày kết thúc',
                type: 'date',
                editable: true,
            },
            guide: {
                title: 'Hướng dẩn viên',
                type: 'string',
                editable: true,
            },
            itinerary: {
                title: 'Chi tiết',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {
                        console.log('detail');
                    });
                },
                filter: false,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor() {}

    ngOnInit() {}
}
