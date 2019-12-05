import { Component, OnInit, ViewChild } from '@angular/core';
import { WatchInfoService } from '../../shared/services/watch-info-service';
import { ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import * as moment from 'moment';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { EditInfoComponent } from './edit-info.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DialogInterface, ButtonStatusEnum } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let paypal: any;
@Component({
    selector: 'ngx-contract',
    template: `
        <nb-card>
            <nb-card-header> </nb-card-header>
            <nb-card-body>
                <div>Bạn muốn xóa hợp đồng {{ this.event.id }}</div>
            </nb-card-body>
        </nb-card>
    `,
})
export class Paypal implements OnInit {
    title: String;
    event: any;
    paidOfCustomer: any;
    idCustomer: any;
    objUser: any;
    idUser: any;
    discount: number;
    constructor(protected ref: NbDialogRef<Paypal>, private contractService: ContractService) {}
    ngOnInit() {}
}
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
            if (resultShedule.attributes.startDay > today) {
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
    // paypalConfig = {
    //     env: 'sandbox',
    //     client: {
    //         sandbox: 'AbZCEhate9NAGs9eIvLkcygXifG5XkIHUMGbOgExHUX2pvylJ9kPIU0tPFtwNRrwFhwH6VtCq7Tc0waT',
    //         production: '<your-production-key here>',
    //     },
    //     commit: true,
    //     payment: (data, actions) => {
    //         return actions.payment.create({
    //             payment: {
    //                 transactions: [{ amount: { total: 22222, currency: 'USD' } }],
    //             },
    //         });
    //     },
    //     onAuthorize: (data, actions) => {
    //         return actions.payment.execute().then(payment => {});
    //     },
    // };

    // tslint:disable-next-line:use-life-cycle-interface
    // ngAfterViewChecked(): void {
    //     if (!this.addScript) {
    //         this.addPaypalScript().then(() => {
    //             paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    //             this.paypalLoad = false;
    //         });
    //     }
    // }

    // addPaypalScript() {
    //     this.addScript = true;
    //     return new Promise((resolve, reject) => {
    //         let scripttagElement = document.createElement('script');
    //         scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
    //         scripttagElement.onload = resolve;
    //         document.body.appendChild(scripttagElement);
    //     });
    // }
}
