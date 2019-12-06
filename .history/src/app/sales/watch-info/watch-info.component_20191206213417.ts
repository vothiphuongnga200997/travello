import { Component, OnInit, ViewChild } from '@angular/core';
import { WatchInfoService } from '../../shared/services/watch-info-service';
import { ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { EditInfoComponent } from './edit-info.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DialogInterface, ButtonStatusEnum } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paypal, InfoTicket } from './paypal.component';
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit {
    addScript: boolean = false;
    paypalLoad: boolean = true;
    pending: Array<any>;
    end: Array<any>;
    idURL: string;
    form1: boolean = true;
    form1edit: boolean = false;
    form2: boolean = false;
    form3: boolean = false;
    fullname: string;
    phone: string;
    email: string;
    type: string;
    disabled: boolean;
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    infoForm: FormGroup;
    changePassword: FormGroup;
    submitted = false;
    payable: number = 0;
    contract: any[];
    status: number;
    get f() {
        return this.infoForm.controls;
    }
    get c() {
        return this.changePassword.controls;
    }
    @ViewChild('confirmDeleteDialog', { static: true }) editDialog: DialogComponent;
    constructor(
        private toastrService: ToastrService,
        private contractService: ContractService,
        private watchInfoService: WatchInfoService,
        private route: ActivatedRoute,
        private dialogService: NbDialogService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
    ) {
        this.idURL = this.route.snapshot.paramMap.get('id');
        this.submit1();
    }
    ngOnInit() {
        this.infoForm = this.formBuilder.group({
            fullname: ['', Validators.required],
            phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            email: ['', [Validators.required, Validators.email]],
        });
        this.changePassword = this.formBuilder.group(
            {
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required],
            },
            {
                validator: MustMatch('password', 'confirmPassword'),
            },
        );
    }
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async getContractD(idContract) {
        let sumMoney = 0;
        let moneySurcharge = 0;
        let schedule = Parse.Object.extend('schedule');
        const querySchedule = new Parse.Query(schedule);

        let pay: Array<any>;
        let date = new Date(
            moment(Date.now())
                .subtract(7, 'day')
                .format('LLL'),
        ); // trước ngày hiện tại 7 ngày sẽ cập nhật giá giảm
        this.contract = [];
        let contract = Parse.Object.extend('contract');
        const queryContract = new Parse.Query(contract);
        queryContract.equalTo('objectId', idContract);
        let data = await queryContract.first();
        if (data) {
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
    }
    infoTicket(id) {
        this.getContractD(id);
        try {
            this.dialogService
                .open(InfoTicket, {
                    context: {
                        title: 'Thông tin vé',
                        event: this.contract,
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        if (data.pennant) {
                        }
                    }
                });
        } catch (ex) {}
    }
    async getContract() {
        this.pending = [];
        this.end = [];
        let today = new Date();
        let result = await this.watchInfoService.getContrat();
        for (let i of result) {
            let schedule = Parse.Object.extend('schedule');
            const querySchedule = new Parse.Query(schedule);
            querySchedule.equalTo('objectId', i.get('objSchedule').id);
            querySchedule.include('objTour');
            querySchedule.select('objTour');
            let resultShedule = await querySchedule.first();
            if (resultShedule.attributes.startDay > today && i.get('status')) {
                let sumSurcharge = 0;
                for (let data of i.attributes.surcharge) {
                    sumSurcharge += data.quantity * data.price;
                }
                this.pending.push({
                    id: i.id,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price - i.attributes.price * i.attributes.discount + sumSurcharge,
                    paid: i.attributes.paid,
                    payable: i.attributes.price - i.attributes.price * i.attributes.discount + sumSurcharge - i.attributes.paid,
                    idShedule: resultShedule.id,
                    codeSchedule: resultShedule.attributes.codeSchedule,
                    departure: resultShedule.attributes.objTour.attributes.departure,
                    duration: resultShedule.attributes.objTour.attributes.duration,
                    endDay: moment(resultShedule.attributes.endDay).format('DD/MM/YYYY, hh:mm A'),
                    startDay: moment(resultShedule.attributes.startDay).format('DD/MM/YYYY, hh:mm A'),
                    daySet: moment(i.attributes.date).format('DD/MM/YYYY, hh:mm A'),
                    hotel: resultShedule.attributes.hotel,
                    vehicle: resultShedule.attributes.objTour.attributes.vehicle,
                    nameTour: resultShedule.attributes.objTour.attributes.nameTour,
                });
            } else {
                this.end.push({
                    id: i.id,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    idShedule: resultShedule.id,
                    codeSchedule: resultShedule.attributes.codeSchedule,
                    departure: resultShedule.attributes.objTour.attributes.departure,
                    duration: resultShedule.attributes.objTour.attributes.duration,
                    endDay: moment(resultShedule.attributes.endDay).format('DD/MM/YYYY, hh:mm A'),
                    startDay: moment(resultShedule.attributes.startDay).format('DD/MM/YYYY, hh:mm A'),
                    daySet: moment(i.attributes.date).format('DD/MM/YYYY, hh:mm A'),
                    hotel: resultShedule.attributes.hotel,
                    vehicle: resultShedule.attributes.objTour.attributes.vehicle,
                    nameTour: resultShedule.attributes.objTour.attributes.nameTour,
                    status: i.get('status'),
                });
            }
        }
    }
    async submit1() {
        this.disabled = true;
        this.form1 = true;
        this.form2 = false;
        this.form3 = false;
        this.form1edit = false;
        let result = await Parse.User.current();
        if (result) {
            this.fullname = result.get('fullname');
            this.email = result.get('email');
            this.phone = result.get('phone');
            if (result.get('moneyPaid') >= 100000000) this.type = 'Khách hàng VIP';
            else {
                if (result.get('moneyPaid') >= 50000000 && result.get('moneyPaid') < 100000000) this.type = 'Khách hàng thân thiện';
                else {
                    this.type = '';
                }
            }
        }
    }
    submit2() {
        this.form1 = false;
        this.form2 = true;
        this.form3 = false;
        this.form1edit = false;
        this.getContract();
    }
    submit3() {
        this.form1 = false;
        this.form2 = false;
        this.form3 = true;
        this.form1edit = false;
    }
    async submit1Edit() {
        this.form1edit = true;
        this.form1 = false;
        this.form2 = false;
        this.form3 = false;
        let result = await Parse.User.current();
        if (result) {
            this.fullname = result.get('fullname');
            this.email = result.get('email');
            this.phone = result.get('phone');
            if (result.get('moneyPaid') >= 100000000) this.type = 'Khách hàng VIP';
            else {
                if (result.get('moneyPaid') >= 50000000 && result.get('moneyPaid') < 100000000) this.type = 'Khách hàng thân thiện';
                else {
                    this.type = '';
                }
            }
        }
    }
    async saveEdit() {
        try {
            let user = await new Parse.User();
            user.set('objectId', this.idURL);
            user.set('fullname', this.fullname);
            user.set('email', this.email);
            user.set('phone', this.phone);
            let objUser = await user.save();
            if (objUser) {
                this.toastrService.success(`Bạn đã thay đổi thông tin`, 'Thành công');
                this.form1 = true;
                this.form2 = false;
                this.form3 = false;
                this.form1edit = false;
                this.submitted = false;
            }
        } catch (ex) {
            this.toastrService.error(`Thông tin bạn chưa được thay đổi`, 'Không thành công');
        }
    }
    edit() {
        if (this.infoForm.invalid) {
            this.submitted = true;
            return;
        } else {
            this.dialogConfig = {
                title: 'Thay đổi',
                content: `Lưu thay đổi`,
                rightBtnLabel: 'Lưu',
                leftBtnLabel: 'Hủy',
                rightBtnStatus: ButtonStatusEnum.Info,
                leftBtnStatus: ButtonStatusEnum.Hint,
            };
            this.editDialog.open();
        }
        this.submitted = false;
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    async openVerticallyCentered1(content, number) {
        this.payable = number;
        this.modalService.open(content, { centered: true });
    }
    async changePass(content) {
        if (this.changePassword.invalid) {
            this.submitted = true;
            return;
        } else {
            try {
                let user = await new Parse.User();
                user.set('password', this.changePassword.value.password);
                user.set('objectId', this.idURL);
                let objUser = await user.save();
                if (objUser) {
                    this.toastrService.success(`Bạn đã thay đổi mật khẩu thành công`, 'Thành công');
                    this.modalService.dismissAll(content);
                } else {
                    this.toastrService.error(`Bạn đã thay đổi mật khẩu không thành công`, 'không thành công');
                }
            } catch (ex) {
                this.toastrService.error(`Bạn đã thay đổi mật khẩu không thành công`, 'không thành công');
            }
        }
        this.submitted = false;
    }
    async detail(id) {
        this.dialogService
            .open(EditInfoComponent, {
                context: {
                    title: 'Delete',
                    idEdit: id,
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
    }

    onpenPaypal(number, id) {
        try {
            this.dialogService
                .open(Paypal, {
                    context: {
                        title: 'Thanh toán',
                        number: number,
                        idContract: id,
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        if (data.pennant) {
                            this.toastrService.success(`Bạn thanh toán thành công`, 'Thành công');
                            this.getContract();
                        }
                    }
                });
        } catch (ex) {}
    }
}
