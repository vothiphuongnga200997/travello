import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { AddTourComponent } from './add-tour/add-tour.component';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from '../../shared/services';
import * as moment from 'moment';
import { CompleterData, CompleterService } from 'ng2-completer';

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
    moduleId: module.id,
    selector: 'ngx-qly-tour',
    templateUrl: './qly-tour.component.html',
    styleUrls: ['./qly-tour.component.scss'],
})
export class QuanLyTourComponent implements OnInit {
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
    protected searchStr: string;
    protected captain: string;
    protected selectedColor: string;
    protected dataService: CompleterData;
    protected searchData = [
        { color: 'red', value: '#f00' },
        { color: 'green', value: '#0f0' },
        { color: 'blue', value: '#00f' },
        { color: 'cyan', value: '#0ff' },
        { color: 'magenta', value: '#f0f' },
        { color: 'yellow', value: '#ff0' },
        { color: 'black', value: '#000' },
        { color: 'flipkart', value: 'flipkart-coupons' },
    ];

    constructor(
        private completerService: CompleterService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private dialogService: NbDialogService,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {}
    protected onSelected(item: CompleterItem) {
        this.selectedColor = item ? item.title : '';
        this.router.navigate(['/store/' + this.selectedColor]);
    }
    async add() {
        this.dialogService
            .open(AddTourComponent, {
                context: {
                    title: 'Add new tour',
                },
            })
            .onClose.subscribe((data: { file: any; version: string; platform: string; isDefault: boolean }) => {
                try {
                    if (data && data.file && data.platform) {
                    }
                } catch (ex) {
                    this.toastrService.error(ex, 'Create error');
                }
            });
    }
}
