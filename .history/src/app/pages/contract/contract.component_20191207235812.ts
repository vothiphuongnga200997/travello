import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DeleteComponent } from './delete-customer';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { LoadingService } from '../../shared/services/loading.service';
import { EditContractComponent } from './add-customer/edit-contract.component';
import * as moment from 'moment';
import * as Parse from 'parse';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { InfoTouristComponent } from './info-tourist/info-tourist.component';
@Component({
    moduleId: module.id,
    selector: 'status-text',
    template: `
        <div style="width:180px">
            <a class="mb-1"
                >Tổng tiền: <a class="font-weight-bold"> {{ this.value[0].sumMoney | number }} đ</a>
            </a>
            <br />
            <a class="mb-1"
                >Thanh toán: <a class="font-weight-bold"> {{ this.value[0].paid | number }} đ</a></a
            >
            <br />
            <a class="mb-1"
                >Còn lại: <a class="font-weight-bold">{{ this.value[0].unpaid | number }} đ</a>
            </a>
            <br />
            <a class="mb-1" *ngIf="this.checkDate">Hạn thanh toán: <br /></a>
            <a *ngIf="this.date" class="text-danger">{{ this.date }}</a>
            <div *ngIf="this.repay">
                <a class="text-danger">{{ this.repay }}</a>
                <br />
                <a class="text-danger">{{ this.money | number }}đ</a>
            </div>
        </div>
    `,
})
export class PayComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: any | number;
    @Input() rowData: any;
    date: String;
    repay: string;
    money: number;
    checkDate: boolean = false;
    ngOnInit() {
        if (
            this.value[0].expiry >
            new Date(
                moment(Date.now())
                    .subtract(3, 'day')
                    .format('LLL'),
            )
        ) {
            this.date = moment(this.value[0].expiry).format('DD/MM/YYYY h:MM A ');
            this.checkDate = true;
        } else {
            this.date = '';
        }
        if (this.value[0].unpaid === 0) {
            this.date = 'Đã Thanh toán';
            this.checkDate = false;
        }
        if (this.value[0].unpaid < 0) {
            this.repay = 'Hoàn trả KH';
            this.money = this.value[0].unpaid * -1;
            this.checkDate = false;
            this.date = '';
        }
    }
}
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

    @Input() value: any;
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

    ngOnInit() {}

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
    paidOfCustomerD: any;
    idCustomerD: any;
    discountD: any;
    objUserD: any;
    idUserD: any;
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
                type: 'custom',
                renderComponent: PayComponent,
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
                        this.taskInfo(row.id, row.status, row);
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

    ngOnInit() {
        // setInterval(async function() {
        //     let contract = Parse.Object.extend('contract');
        //     const query = new Parse.Query(contract);
        //     query.lessThanOrEqualTo('expiryDate', new Date());
        //     query.equalTo('status', true);
        //     let result = query.find();
        //     if (result) {
        //         console.log(result);
        //         for (let data of result) {
        //             let dataSchedule: any = {};
        //             let dataCustomer: any = {};
        //             let dataContract: any = {};
        //             let schedule = Parse.Object.extend('schedule');
        //             let ObjectSchedule = new schedule();
        //             let customer = Parse.Object.extend('customer');
        //             let ObjectCustomer = new customer();
        //             let objContract = new contract();
        //             let sum = 0;
        //             this.getCustomer(data.get('objUser'));
        //             for (let sur of data.get('surcharge')) {
        //                 sum += sur.get('quantity') * sur.get('price');
        //             }
        //             let price = data.get('price') - data.get('price') * data.get('discount') + sum;
        //             if (data.get('paid') === 0 || data.get('paid') < price) {
        //                 dataContract.objectId = data.id;
        //                 dataContract.status = false;
        //                 let saveContract = await objContract.save(dataContract);
        //                 if (saveContract) {
        //                     dataSchedule.objectId = data.get('objSchedule').id;
        //                     dataSchedule.empty = await this.setEmpty(
        //                         data.get('objSchedule').id,
        //                         data
        //                             .get('objSchedule')
        //                             .get('objTour')
        //                             .get('quantity'),
        //                     );
        //                     await ObjectSchedule.save(dataSchedule);
        //                     dataCustomer.objectId = data.idCustomer;
        //                     dataCustomer.objUser = data.info.idUser;
        //                     dataCustomer.paid = data.paidOfCuctomer + data.price;
        //                     dataCustomer.discount = 0;
        //                     if (data.paidOfCuctomer + data.price >= 100000000) dataCustomer.discount = 0.1;
        //                     if (data.paidOfCuctomer + data.price < 100000000 && data.paidOfCuctomer + data.price >= 50000000)
        //                         dataCustomer.discount = 0.05;
        //                     await ObjectCustomer.save(dataCustomer);
        //                 }
        //             }
        //         }
        //     }
        // }, 600000);
    }
    async clic() {
        let contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        let i = 0;
        query.lessThanOrEqualTo('expiryDate', new Date());
        query.equalTo('status', true);
        let result = await query.find();
        if (result) {
            console.log(result);
            for (let data of result) {
                let dataSchedule: any = {};
                let dataCustomer: any = {};
                let dataContract: any = {};

                let schedule = Parse.Object.extend('schedule');
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
                    this.getCustomer(data.get('objUser'));
                    console.log('ngaaaa', i);
                    dataContract.objectId = data.id;
                    dataContract.status = false;
                    // let saveContract = await objContract.save(dataContract);
                    if (true) {
                        dataSchedule.objectId = data.get('objSchedule').id;
                        // dataSchedule.empty = await this.contractService.setEmpty(
                        data.get('objSchedule').id,
                            data
                                .get('objSchedule')
                                .get('objTour')
                                .get('quantity');
                        // await ObjectSchedule.save(dataSchedule);

                        dataCustomer.objectId = data.idCustomer;
                        dataCustomer.objUser = data.get('objUser').id;
                        dataCustomer.paid = data.paidOfCuctomer + data.price;
                        dataCustomer.discount = 0;
                        if (data.paidOfCuctomer + data.price >= 100000000) dataCustomer.discount = 0.1;
                        if (data.paidOfCuctomer + data.price < 100000000 && data.paidOfCuctomer + data.price >= 50000000)
                            dataCustomer.discount = 0.05;
                        // await ObjectCustomer.save(dataCustomer);
                    }
                }
                i++;
            }
        }
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

    async check() {
        let contract = Parse.Object.extend('contract');
        const query = new Parse.Query(contract);
        query.lessThanOrEqualTo('expiryDate', new Date());
        query.equalTo('status', true);
        let result = await query.find();
        if (result) {
            for (let data of result) {
                let sum = 0;
                if (data.get('surcharge').length > 0) {
                    for (let sur of data.get('surcharge')) {
                        sum += sur.get('quantity') * sur.get('price');
                    }
                    let price = data.get('price') - data.get('price') * data.get('discount') + sum;
                    if (data.get('paid') === 0) {
                        console.log('huy', data.id);
                    } else {
                        if (data.get('paid') < price) {
                            console.log('huy', data.id);
                        }
                    }
                }
            }
        }
    }
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async addCustom() {
        try {
            this.dialogService
                .open(AddCustomerComponent, {
                    context: {
                        title: 'THÊM HỢP ĐỒNG',
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
        this.loadingService.start();
        let sumMoney = 0;
        let moneySurcharge = 0;
        let result = await this.contractService.getContrat();
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);

        let pay: Array<any>;
        let date = new Date(
            moment(Date.now())
                .subtract(7, 'day')
                .format('LLL'),
        ); // trước ngày hiện tại 7 ngày sẽ cập nhật giá giảm
        this.contract = [];
        if (result) {
            for (let data of result) {
                pay = [];
                sumMoney = 0;
                moneySurcharge = 0;
                for (let surcharge of data.get('surcharge')) {
                    if (surcharge.quantity > 0) {
                        moneySurcharge += surcharge.quantity * surcharge.price;
                    }
                }
                querySchedule.equalTo('objectId', data.get('objSchedule').id);
                querySchedule.include('objTour');
                let resultShedule = await querySchedule.first();
                let email = await this.contractService.getUserId(data.get('objUser').id);

                sumMoney = data.get('price') + moneySurcharge - data.get('price') * data.get('discount');
                pay.push({
                    sumMoney: sumMoney,
                    paid: data.get('paid'),
                    unpaid: sumMoney - data.get('paid'),
                    expiry: data.get('expiryDate'),
                });
                if (data.get('objSchedule').get('endDay') < date) this.status = 0;
                else this.status = 1;
                this.contract.push({
                    id: data.id,
                    fullname: this.capital_letter(data.get('objUser').get('fullname')),
                    email: email.attributes.email,
                    phone: data.get('objUser').get('phone'),
                    quantity: data.get('numberKids') + data.get('numberAdult'),
                    createAt: moment(data.get('date')).format('DD/MM/YYYY'),
                    pay: pay,
                    tour: data.get('objSchedule').get('codeSchedule'),
                    idSchedule: data.get('objSchedule').id,
                    nameTour: resultShedule.get('objTour').get('nameTour'),
                    startDay: moment(data.get('objSchedule').get('startDay')).format('DD/MM/YYYY'),
                    tourist: data.get('infoCustom'),
                    price: data.get('price') - data.get('price') * data.get('discount') + moneySurcharge,
                    tourQuantity: resultShedule.get('objTour').get('quantity'),
                    status: this.status,
                    idUser: data.get('objUser'),
                    paid: data.get('paid'),
                    startDayEdit: data.get('objSchedule').get('startDay'),
                });
            }
            this.source.load(this.contract);
            this.source.setSort([{ field: 'status', direction: 'desc' }]);
        }
        this.loadingService.stop();
    }
    delete(event) {
        this.dialogService
            .open(DeleteComponent, {
                context: {
                    title: 'XÓA ',
                    event: event.data,
                },
            })
            .onClose.subscribe(async data => {
                if (data.pennant === true) {
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
                        title: 'SỬA THÔNG TIN',
                        idEdit: event.data.id,
                        startDay: event.data.startDayEdit,
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
    taskInfo(idContract, status, event) {
        this.dialogService
            .open(InfoTouristComponent, {
                context: {
                    title: `Thông tin hành khách`,
                    idContract: idContract,
                    status: status,
                    event: event,
                },
            })
            .onClose.subscribe(async data => {
                if (data) {
                    if (data.pennant === true) {
                        await this.getContract();
                        this.toastrService.success(`Xóa thành công `, 'Thành công');
                    } else {
                        if (data.pennant !== 1 && data.pennant !== 0) this.toastrService.error(data.pennant, `Thành công`);
                    }
                }
            });
    }
}
