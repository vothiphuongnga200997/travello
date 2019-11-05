import { Component, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from '../../shared/services';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { AddTourComponent } from './add-tour/add-tour.component';
import { TourService } from '../../shared/services/tour.service';
import * as moment from 'moment';
import { LoadingService } from '../../shared/services/loading.service';
import { ButtonStatusEnum, DialogInterface } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { DetailComponent } from './detail/detail.component';
import { EditTourComponent } from './add-tour/edit-tour.component';
// Status-text

// Status-text

// Button view

// Button view

@Component({
    selector: 'ngx-manage-tour',
    templateUrl: './manage-tour.component.html',
    styleUrls: ['./manage-tour.component.scss'],
})
export class ManageTourComponent implements OnInit {
    searchText;
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
    page = 1;
    pageSize = 6;
    salloff: Array<any>;

    @ViewChild('confirmDeleteDialog', { static: true }) deleteDialog: DialogComponent;

    @ViewChild('item', { static: true }) accordion;

    toggle() {
        this.accordion.toggle();
    }

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
        private windowService: NbWindowService,
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
        let pending: Array<any>;
        this.salloff = [];
        let i = 0;
        if (this.data) {
            this.infoTour = [];
            await this.data.map(async res => {
                pending = [];
                for (let time of res.schedule) {
                    if (time.get('startDay') > Date.now()) {
                        pending.push({ date: moment(time.get('startDay')).format('DD/MM/YYYY, h:mm A') });
                    }
                }
                if (res.get('saleoff') > 0) this.salloff[i] = true;
                await this.infoTour.push({
                    obj: res.info,
                    code: res.info.get('code'),
                    name: res.info.get('nameTour'),
                    quantity: res.info.get('quantity'),
                    pending: pending,
                    sumSchedule: res.schedule.length,
                });
            });
            i++;
        }
    }
    edit(event) {
        this.dialogService
            .open(EditTourComponent, {
                context: {
                    title: 'Edit',
                    obj: event,
                },
            })
            .onClose.subscribe(async data => {
                this.getTour();
            });
        //     .onClose.subscribe(async data => {
        //         if (data) {
        //             try {
        //                 this.loadingService.start();
        //                 await this.tourService.editTour(data);
        //                 await this.getTour();
        //                 this.loadingService.stop();
        //                 this.toastrService.success(`Update Tour Success`, 'Update success');
        //             } catch (ex) {
        //                 this.toastrService.error(ex, `Update Error`);
        //             }
        //         }
        //     });
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
    taskInfo(event) {
        this.windowService
            .open(DetailComponent, {
                title: `Thông tin hành khách`,
                context: {
                    event: event,
                },
            })
            .onClose.subscribe();
    }
}
