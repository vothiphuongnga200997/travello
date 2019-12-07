import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { AddGuideComponent } from './add-guide/add-guide.component';
import { ToastrService } from '../../shared/services';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { GuideService } from '../../shared/services/guide.service';
import * as moment from 'moment';
import { DialogInterface, ButtonStatusEnum } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { TaskGuideComponent } from './task-guide/task-guide.component';
import { LoadingService } from '../../shared/services/loading.service';
import * as Parse from 'parse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    selector: 'ngx-manage-guide',
    templateUrl: './manage-guide.component.html',
    styleUrls: ['./manage-guide.component.scss'],
})
export class ManageGuideComponent implements OnInit {
    generalSource: SafeResourceUrl;
    obj: string;
    schedule: Array<any>;

    robotSource: SafeResourceUrl;
    metricSource: SafeResourceUrl;
    statisticsSource: SafeResourceUrl;
    date: Date;

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
        mode: 'external',
        columns: {
            id: {
                title: 'Id',
                type: 'string',
                editable: true,
            },
            fullname: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            birthday: {
                title: 'Ngày sinh',
                type: 'datetime',
                editable: true,
            },
            address: {
                title: 'Địa chỉ',
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
                type: 'string',
                editable: true,
            },
            task: {
                title: 'Lịch tour',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {
                        this.taskGuide(row.res);
                    });
                },
                filter: false,
            },
        },
    };
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    @ViewChild('confirmDeleteDialog', { static: true }) deleteDialog: DialogComponent;

    source: LocalDataSource = new LocalDataSource();
    paidOfCustomerD: any;
    idCustomerD: any;
    objUserD: any;
    discountD: any;
    constructor(
        private dialogService: NbDialogService,
        private toastrService: ToastrService,
        private guideService: GuideService,
        private loadingService: LoadingService,
        private windowService: NbWindowService,
        private modalService: NgbModal,
    ) {
        this.getGuides();
    }

    ngOnInit() {
        setInterval(async function() {
            let contract = Parse.Object.extend('contract');
            const query = new Parse.Query(contract);
            let schedule = Parse.Object.extend('schedule');
            let innerQuery = new Parse.Query(schedule);
            let i = 0;
            innerQuery.greaterThan('startDay', new Date());
            query.matchesQuery('objSchedule', innerQuery);
            query.lessThanOrEqualTo('expiryDate', new Date());
            query.equalTo('status', true);
            query.include('objSchedule', 'objUser');
            let result = await query.find();
            if (result) {
                console.log(result);
                for (let data of result) {
                    let dataSchedule: any = {};
                    let dataCustomer: any = {};
                    let dataContract: any = {};
                    let ObjectSchedule = new schedule();
                    let customer = Parse.Object.extend('customer');
                    let ObjectCustomer = new customer();
                    let objContract = new contract();
                    let sum = 0;
                    if (data.get('surcharge').length > 0) {
                        for (let sur of data.get('surcharge')) {
                            sum += sur.quantity * sur.price;
                        }
                    }
                    let price = data.get('price') - data.get('price') * data.get('discount') + sum;
                    if (data.get('paid') === 0 || data.get('paid') < price) {
                        await this.getCustomer(data.get('objUser'));
                        console.log('ngaaaa', i);
                        dataContract.objectId = data.id;
                        dataContract.status = false;
                        let saveContract = await objContract.save(dataContract);
                        if (true) {
                            let querySchedule = new Parse.Query(schedule);
                            querySchedule.equalTo('objectId', data.get('objSchedule').id);
                            querySchedule.select('objTour');
                            let resultSchedule = await querySchedule.first();
                            dataSchedule.objectId = data.get('objSchedule').id;
                            dataSchedule.empty = await this.contractService.setEmpty(
                                data.get('objSchedule').id,
                                resultSchedule.get('objTour').get('quantity'),
                            );
                            await ObjectSchedule.save(dataSchedule);
                            console.log(dataSchedule);
                            dataCustomer.objectId = this.idCustomerD;
                            dataCustomer.paid = this.paidOfCustomerD - price;
                            dataCustomer.discount = 0;
                            if (this.paidOfCustomerD - price >= 100000000) dataCustomer.discount = 0.1;
                            if (this.paidOfCustomerD - price < 100000000 && this.paidOfCustomerD - price >= 50000000)
                                dataCustomer.discount = 0.05;
                            console.log(dataCustomer);
                            await ObjectCustomer.save(dataCustomer);
                        }
                        let innerQuery1 = new Parse.Query(schedule);
                        const query1 = new Parse.Query(contract);
                        innerQuery.greaterThanOrEqualTo('startDay', new Date());
                        query1.matchesQuery('objSchedule', innerQuery1);
                        query1.equalTo('status', true);
                        query1.equalTo('objUser', saveContract.get('objUser'));
                        let r = await query1.find();
                        if (r.length > 0) {
                            for (let data1 of r) {
                                let objContract1 = await new contract();
                                if (dataCustomer.discount < data1.get('discount')) {
                                    objContract.set('objectId', data.id);
                                    objContract.set('discount', dataCustomer.discount);
                                    await objContract1.save();
                                }
                            }
                        }
                    }
                }
            }
        }, 600000);
    }
    async getCustomer(idUserD) {
        const custom = Parse.Object.extend('customer');
        const query = new Parse.Query(custom);
        query.equalTo('objUser', idUserD);
        let result = await query.first();
        if (result) {
            this.paidOfCustomerD = result.attributes.paid;
            this.idCustomerD = result.id;
            this.objUserD = result.attributes.objUser;
            this.discountD = result.attributes.discount;
        }
    }

    async add() {
        this.dialogService
            .open(AddGuideComponent, {
                context: {
                    title: 'THÊM HƯỚNG DẪN VIÊN',
                },
            })
            .onClose.subscribe(async (data: { fullname: string; email: string; phone: any; address: string; birthday: any }) => {
                if (data) {
                    try {
                        await this.guideService.addGuide(data.fullname, data.email, data.address, data.phone, data.birthday);
                        await this.getGuides();
                        this.toastrService.success(`Add Location Success`, 'Create success');
                    } catch (ex) {
                        this.toastrService.error(ex, `Create Error`);
                    }
                }
            });
    }
    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('DD-MM-YYYY');
    }
    async getGuides() {
        let i = await this.guideService.getListGuides();
        if (i && i.length) {
            let dataSourses = i.map(res => {
                return {
                    res: res,
                    id: res.id,
                    fullname: res.get('fullname'),
                    email: res.get('email'),
                    phone: res.get('phone'),
                    address: res.get('address'),
                    birthday: this.formatDate(res.get('birthday')),
                    date: res.get('birthday'),
                };
            });
            this.source.load(dataSourses);
        }
    }
    edit(event) {
        this.dialogService
            .open(AddGuideComponent, {
                context: {
                    title: 'SỬA THÔNG TIN',
                    obj: event.data,
                },
            })
            .onClose.subscribe(
                async (data: { id: string; fullname: string; email: string; phone: any; address: string; birthday: any }) => {
                    if (data) {
                        try {
                            let i = await this.guideService.editGuide(
                                data.id,
                                data.fullname,
                                data.email,
                                data.address,
                                data.phone,
                                data.birthday,
                            );
                            await this.getGuides();
                            this.toastrService.success(`Update Guide Success`, 'Update success');
                        } catch (ex) {
                            this.toastrService.error(ex, `Update Error`);
                        }
                    }
                },
            );
    }
    async delete(event, content) {
        this.schedule = [];
        const currentDate = new Date();
        const schedule = Parse.Object.extend('schedule');
        const query = new Parse.Query(schedule);
        query.greaterThan('endDay', currentDate);
        query.equalTo('objGuide', event.data.res);
        const result = await query.find();
        if (result.length > 0) {
            for (let data of result) {
                this.schedule.push({
                    schedule: data.get('codeSchedule'),
                });
            }
            this.modalService.open(content);
        } else {
            console.log(event);
            this.dialogConfig = {
                title: 'XÓA HƯỚNG DẪN VIÊN',
                content: `BẠN MUỐN XÓA HDV ${event.data.fullname}?`,
                data: event.data,
                rightBtnLabel: 'OK',
                leftBtnLabel: 'Cancel',
                rightBtnStatus: ButtonStatusEnum.Info,
                leftBtnStatus: ButtonStatusEnum.Hint,
            };
            this.deleteDialog.open();
        }
    }
    async onDelete(event) {
        try {
            let result = await this.guideService.delete(event.id);
            if (result) {
                this.toastrService.success(`XÓA ${event.id} THÀNH CÔNG`, `THÀNH CÔNG`);
                this.getGuides();
            } else {
                this.toastrService.error(`XÓA ${event.id} KHÔNG THÀNH CÔNG`, `KHÔNG THÀNH CÔNG`);
            }
        } catch (error) {
            this.toastrService.error(error, `LỖI`);
        }
    }
    taskGuide(id) {
        this.windowService
            .open(TaskGuideComponent, {
                title: `LỊCH TRÌNH`,
                context: {
                    id: id,
                },
            })
            .onClose.subscribe();
    }
}
