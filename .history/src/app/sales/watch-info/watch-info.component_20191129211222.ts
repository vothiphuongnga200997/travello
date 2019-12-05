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
                this.pending.push({
                    id: i.id,
                    numberAdult: i.attributes.numberAdult,
                    numberKids: i.attributes.numberKids,
                    price: i.attributes.price,
                    paid: i.attributes.paid,
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
                this.form1 = true;
                this.form2 = false;
                this.form3 = false;
                this.form1edit = false;
                this.submitted = false;
            }
        } catch (ex) {
            console.log(ex);
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
    async changePass(content) {
        if (this.changePassword.invalid) {
            this.submitted = true;
            return;
        } else {
            let user = await new Parse.User();
            user.set('password', this.changePass);
            let objUser = await user.save();
            if (objUser) {
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
}