import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ToastrService } from '../../shared/services';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { AddTourComponent } from './add-tour/add-tour.component';
import { TourService } from '../../shared/services/tour.service';
import * as moment from 'moment';
import { LoadingService } from '../../shared/services/loading.service';
import { ButtonStatusEnum, DialogInterface } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';

// Status-text
@Component({
    moduleId: module.id,
    selector: 'status-text',
    template: `
        <div>
            <a class="d-flex justify-content-center text-success" *ngIf="value === 'pending'"> Pending </a>
            <a class="d-flex justify-content-center text-warning" *ngIf="value === 'done'"> Done </a>
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
// Status-text

// Button view
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
// Button view

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
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    @ViewChild('confirmDeleteDialog', { static: true }) deleteDialog: DialogComponent;

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
        mode: 'external',

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
            startDay: {
                title: 'Ngày khởi hành',
                type: 'string',
                editable: true,
            },
            status: {
                title: 'Trạng thái',
                type: 'custom',
                renderComponent: StatusTextComponent,
            },
            itinerary: {
                title: 'Chi tiết',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {});
                },
                filter: false,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'mytable',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };
    constructor(
        private exportAsService: ExportAsService,

        private loadingService: LoadingService,
        private dialogService: NbDialogService,
        private toastrService: ToastrService,
        private tourService: TourService,
    ) {
        this.getTour();
    }

    ngOnInit() {}
    exportAs(type: SupportedExtensions, opt?: string) {
        this.config.type = type;
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }
        this.exportAsService.save(this.config, 'myFile').subscribe(() => {});
    }
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
                        await this.tourService.addTour(data);
                        this.loadingService.start();
                        await this.getTour();
                        this.loadingService.stop();
                        this.toastrService.success(`Add Tour Success`, 'Create success');
                    }
                } catch (ex) {
                    this.loadingService.stop();
                    this.toastrService.error(ex, 'Create error');
                }
            });
    }
    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('HH:mm DD/MM/YYYY');
    }
    async getTour() {
        this.data = await this.tourService.getTour();
        let dateNow = new Date();
        if (this.data) {
            let dataSources = this.data.map(res => {
                if (res.get('endDay') < dateNow) this.status = 'done';
                else this.status = 'pending';
                let resuls = this.tourService.getQuantity(res.id);
                if (resuls.length > 0) {
                    const i = resuls[0].id;
                }
                return {
                    res: res,
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
    edit(event) {
        this.dialogService
            .open(AddTourComponent, {
                context: {
                    title: 'Edit',
                    obj: event.data,
                },
            })
            .onClose.subscribe(async data => {
                if (data) {
                    try {
                        this.loadingService.start();
                        await this.tourService.editTour(data);
                        await this.getTour();
                        this.loadingService.stop();

                        this.toastrService.success(`Update Tour Success`, 'Update success');
                    } catch (ex) {
                        this.toastrService.error(ex, `Update Error`);
                    }
                }
            });
    }
    delete(event) {
        this.dialogConfig = {
            title: 'Delete Tour',
            content: `Do you want to delete tour ${event.data.code}?`,
            data: event.data,
            rightBtnLabel: 'OK',
            leftBtnLabel: 'Cancel',
            rightBtnStatus: ButtonStatusEnum.Info,
            leftBtnStatus: ButtonStatusEnum.Hint,
        };
        this.deleteDialog.open();
    }
    async onDelete(event) {
        try {
            let result = await this.tourService.deleteTour(event.res);
            if (result) {
                this.toastrService.success(`Delete tour ${event.code} success`, `Delete tour`);
                this.getTour();
            } else {
                this.toastrService.error(`Delete tour ${event.code} fail`, `Delete tour`);
            }
        } catch (error) {
            this.toastrService.error(error, `Delete tour`);
        }
    }
}
