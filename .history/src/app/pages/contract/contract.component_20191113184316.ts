import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DeleteComponent } from './delete-customer';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { LoadingService } from '../../shared/services/loading.service';
import { EditContractComponent } from './add-customer/edit-contract.component';
import { ContractCancelComponent } from './contractCancel.component';
import * as moment from 'moment';
import * as Parse from 'parse';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { InfoTouristComponent } from './info-tourist/info-tourist.component';
@Component({
    moduleId: module.id,
    selector: 'status-text',
    template: `
        <div>
            <a class="d-flex justify-content-center text-success" *ngIf="value == 1"> Mở </a>
            <a class="d-flex justify-content-center text-warning" *ngIf="value == 0"> Đóng </a>
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
@Component({
    moduleId: module.id,
    selector: 'button-view',
    template: `
        <div class="download">
            <a class="d-flex justify-content-center" (click)="onClick()"
                ><img style="height: 25px;width: 25px;" src="../../../assets/images/calendar.png"
            /></a>
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
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    searchText;
    contract: Array<any> = [];
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
    name: String;
    codeTour: String;
    nameTour: String;
    startDay: any;
    endDay: any;
    phone: any;
    idCustom: String;
    status: number;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'mytable',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };
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
            id: {
                title: 'Mã giao dịch',
                type: 'string',
                editable: true,
            },
            fullname: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            email: {
                title: 'Email',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'number',
                editable: true,
            },
            quantity: {
                title: 'Số lượng',
                type: 'number',
                editable: true,
            },
            tour: {
                title: 'Tour',
                type: 'string',
                editable: true,
            },
            pay: {
                title: 'Thanh toán',
                type: 'string',
                editable: true,
            },
            createAt: {
                title: 'Ngày đặt',
                type: 'string',
                editable: true,
            },
            status: {
                title: 'Trạng thái',
                type: 'custom',
                renderComponent: StatusTextComponent,
            },
            task: {
                title: 'Chi tiết',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {
                        this.taskInfo(row.id, row.status);
                    });
                },
                filter: false,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor(
        private exportAsService: ExportAsService,
        private toastrService: ToastrService,
        private dialogService: NbDialogService,
        private contractService: ContractService,
        private loadingService: LoadingService,
        private windowService: NbWindowService,
    ) {
        console.log('dgdg');
        this.getContract();
    }

    ngOnInit() {}

    async addCustom() {
        try {
            this.dialogService
                .open(AddCustomerComponent, {
                    context: {
                        title: 'Create',
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        try {
                            this.loadingService.start();
                            let result = await this.contractService.addContract(data);
                            this.loadingService.stop();
                            if (result) {
                                await this.getContract();
                                this.toastrService.success(`Add Success`, 'Add success');
                            }
                        } catch (ex) {
                            this.loadingService.stop();
                            this.toastrService.error(ex, `Add Error`);
                        }
                    }
                });
        } catch (ex) {
            this.toastrService.error(ex, `Add Error`);
        }
    }
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'đ';
    }

    async getContract() {
        let result = await this.contractService.getContrat();
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);
        let dateNow = new Date();
        this.contract = [];
        if (result) {
            for (let data of result) {
                querySchedule.equalTo('objectId', data.get('objSchedule').id);
                querySchedule.include('objTour');
                let resultShedule = await querySchedule.first();

                let email = await this.contractService.getUserId(data.get('objUser').id);
                let startDate = moment(data.get('date'), 'DD/MM/YYYY');
                let currenDate = moment(new Date()).format('DD/MM/YYYY');
                let endDate = moment(currenDate, 'DD/MM/YYYY');
                let diffInDays = endDate.diff(startDate, 'days');
                if (data.get('objSchedule').get('endDay') < dateNow) this.status = 0;
                else this.status = 1;
                this.contract.push({
                    id: data.id,
                    fullname: data.get('objUser').get('fullname'),
                    email: email.attributes.email,
                    phone: data.get('objUser').get('phone'),
                    quantity: data.get('numberKids') + data.get('numberAdult'),
                    createAt: moment(data.get('createAt')).format('DD/MM/YYYY'),
                    pay:
                        'Tổng tiền: ' +
                        this.formatNumber(data.get('price')) +
                        ' Đã trả:' +
                        this.formatNumber(data.get('paid')) +
                        ' Còn lại',
                    tour: data.get('objSchedule').get('codeSchedule'),
                    idSchedule: data.get('objSchedule').id,
                    nameTour: resultShedule.get('objTour').get('nameTour'),
                    startDay: moment(data.get('objSchedule').get('startDay')).format('DD/MM/YYYY'),
                    tourist: data.get('infoCustom'),
                    price: data.get('price'),
                    tourQuantity: resultShedule.get('objTour').get('quantity'),
                    status: this.status,
                    idUser: data.get('objUser'),
                });
            }
            this.source.load(this.contract);
            this.source.setSort([{ field: 'status', direction: 'desc' }]);
        }
    }
    delete(event) {
        this.dialogService
            .open(DeleteComponent, {
                context: {
                    title: 'Delete',
                    event: event,
                },
            })
            .onClose.subscribe(async data => {
                if (data.pennant === 1) {
                    await this.getContract();
                    this.toastrService.success(`Delete Success`, 'Delete success');
                } else {
                    if (data.pennant !== 1 && data.pennant !== 0) this.toastrService.error(data.pennant, `Delete Error`);
                }
            });
    }

    edit(event) {
        console.log(event);
        try {
            this.dialogService
                .open(EditContractComponent, {
                    context: {
                        title: 'Create',
                        idEdit: event.data.id,
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        try {
                            await this.contractService.editContract(data);
                            this.getContract();
                            this.toastrService.success(`Update Success`, 'Update success');
                        } catch (ex) {
                            this.toastrService.error(ex, `Update Error`);
                        }
                    }
                });
        } catch (ex) {
            this.toastrService.error(ex, `Add Error`);
        }
    }
    async filter() {
        this.contract = [];
        let dateNow = new Date();
        this.loadingService.start();
        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);
        let user = Parse.Object.extend('User');
        let innerQuery = new Parse.Query(user);
        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);
        if (this.name !== null && this.name !== undefined && this.name !== '') {
            innerQuery.fullText('fullname', this.name);
            query.matchesQuery('objUser', innerQuery);
        }
        if (this.phone !== null && this.phone !== undefined && this.phone !== '') {
            innerQuery.equalTo('phone', parseFloat(this.phone.toString()));
            query.matchesQuery('objUser', innerQuery);
        }
        if (this.codeTour !== null && this.codeTour !== undefined && this.codeTour !== '') {
            innerQueryTour.equalTo('code', this.codeTour);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.startDay !== null && this.startDay !== undefined && this.startDay !== '') {
            innerQueryTour.greaterThan('startDay', this.startDay);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.endDay !== null && this.endDay !== undefined && this.endDay !== '') {
            innerQueryTour.lessThan('endDay', this.endDay);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.idCustom !== null && this.idCustom !== undefined && this.idCustom !== '') {
            query.equanTo('objectId', this.idCustom);
        }
        let result = await query.find();
        if (result) {
            for (let data of result) {
                try {
                    let email = await this.contractService.getUserId(data.get('objUser').id);
                    if (data.get('objSchedule').get('endDay') < dateNow) this.status = 0;
                    else this.status = 1;
                    this.contract.push({
                        id: data.id,
                        fullname: data.get('objUser').get('fullname'),
                        email: email.attributes.email,
                        phone: data.get('objUser').get('phone'),
                        quantity: data.get('numberKids') + data.get('numberAdult'),
                        createAt: moment(data.get('createAt')).format('DD/MM/YYYY'),
                        pay:
                            'Tổng tiền: ' +
                            this.formatNumber(data.get('price')) +
                            ' Đã trả:' +
                            this.formatNumber(data.get('paid')) +
                            ' Còn lại',
                        tour: data.get('objTour').get('code'),
                        idTour: data.get('objTour').id,
                        nameTour: data.get('objTour').get('nameTour'),
                        startDay: moment(data.get('objTour').get('startDay')).format('DD/MM/YYYY'),
                        tourist: data.get('infoCustom'),
                        price: data.get('price'),
                        tourQuantity: data.get('objTour').get('quantity'),
                        status: this.status,
                    });
                } catch (ex) {
                    this.loadingService.stop();
                    throw ex;
                }
            }
            this.source.load(this.contract);
            this.source.setSort([{ field: 'status', direction: 'desc' }]);
            this.loadingService.stop();
        }
    }
    exportAs(type: SupportedExtensions, opt?: string) {
        this.config.type = type;
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }
        this.exportAsService.save(this.config, 'myFile').subscribe(() => {});
    }
    openContractCancel() {
        this.windowService
            .open(ContractCancelComponent, {
                title: `Work schedules`,
                context: {},
            })
            .onClose.subscribe();
    }
    taskInfo(event, status) {
        this.windowService
            .open(InfoTouristComponent, {
                title: `Thông tin hành khách`,
                context: {
                    event: event,
                    status: status,
                },
            })
            .onClose.subscribe();
    }
}
