import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ToastrService } from '../../shared/services';
import { NbDialogService } from '@nebular/theme';
import { AddTourComponent } from './add-tour/add-tour.component';

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
    selector: 'ngx-manage-tour',
    templateUrl: './manage-tour.component.html',
    styleUrls: ['./manage-tour.component.scss'],
})
export class ManageTourComponent implements OnInit {
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

    constructor(private dialogService: NbDialogService, private toastrService: ToastrService) {}

    ngOnInit() {}

    async add() {
        this.dialogService
            .open(AddTourComponent, {
                context: {
                    title: 'Add new tour',
                },
            })
            .onClose.subscribe((data: { file: any; version: string; platform: string; isDefault: boolean }) => {
                try {
                    if (data) {
                        console.log(data);
                    }
                } catch (ex) {
                    this.toastrService.error(ex, 'Create error');
                }
            });
    }
}
