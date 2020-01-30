import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ToastrService } from '../../shared/services';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { AddTourComponent } from './add-tour/add-tour.component';
import { TourService } from '../../shared/services/tour.service';
import * as moment from 'moment';

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

// Status button here
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
    infoTour: Array<any> = [];
    public data: any;
    status: string;
    @ViewChild('item', { static: true }) accordion;

    toggle() {
        this.accordion.toggle();
    }
    settings = {
        actions: {
            add: false,
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
            code: {
                title: 'Mã tour',
                type: 'string',
                editable: false,
            },
            name: {
                title: 'Tên tour',
                type: 'string',
                editable: true,
            },

            startDay: {
                title: 'Ngày khởi hành',
                type: 'string',
                editable: true,
            },
            quantity: {
                title: 'Số chổ',
                type: 'number',
                editable: true,
            },
            empty: {
                title: 'Đã đặt',
                type: 'number',
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
            status: {
                title: 'Trạng thái',
                type: 'custom',
                renderComponent: StatusTextComponent,
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();

    constructor(private dialogService: NbDialogService, private toastrService: ToastrService, private tourService: TourService) {
        this.getTour();
    }

    ngOnInit() {}

    async add() {
        this.dialogService
            .open(AddTourComponent, {
                context: {
                    title: 'Add new tour',
                },
                closeOnBackdropClick: false,
            })
            .onClose.subscribe(async data => {
                try {
                    if (data) {
                        let i = await this.tourService.addTour(data);
                        await this.getTour();
                        this.toastrService.success(`Add Location Success`, 'Create success');
                        console.log(i);
                    }
                } catch (ex) {
                    this.toastrService.error(ex, 'Create error');
                }
            });
    }
    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('DD/MM/YYYY');
    }
    async getTour() {
        this.data = await this.tourService.getTour();
        console.log(Date());
        let dateOne = new Date(2012, 0, 15); //Year, Month, Date
        let dateTwo = new Date(2011, 0, 15); //Year, Month, Date
        if (dateOne > dateTwo) {
            alert('Date One is greater than Date Two.');
        } else {
            alert('Date Two is greater than Date One.');
        }
        if (this.data && this.data) {
            let dataSources = this.data.map(res => {
                if (res.get('endDay') > dateTwo) this.status = 'done';
                if (res.get('endDay') < dateOne) this.status = 'pending';
                console.log(res.get('endDay'));
                return {
                    id: res.id,
                    code: res.get('code'),
                    name: res.get('nameTour'),
                    startDay: this.formatDate(res.get('startDay')) + '-' + this.formatDate(res.get('endDay')),
                    quantity: res.get('quantity'),
                    status: this.status,
                };
            });
            this.source.load(dataSources);
        }
    }
}

@Component({
    moduleId: module.id,
    selector: 'status-text',
    template: `
        <div>
            <a class="d-flex justify-content-center text-primary" *ngIf="value == 'pending'"> Pending </a>
            <a class="d-flex justify-content-center text-danger" *ngIf="value == 'done'"> Done </a>
        </div>
    `,
})
export class StatusTextComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }
}