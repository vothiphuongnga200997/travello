import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../../shared/services/contract.service';
import * as moment from 'moment';
import { R3DelegatedFnOrClassMetadata } from '@angular/compiler/src/render3/r3_factory';
import { CompleterData, CompleterService } from 'ng2-completer';
@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    protected dataService: CompleterData;
    objUser: Array<any> = [];
    title: String;
    submitted = false;
    public form: FormGroup;
    public contactList: FormArray;
    tour: Array<any> = [];
    startDay: any;
    endDay: any;
    existUser: String;
    birthday: any;
    price: number = 0;
    objTour: String;
    adultPrice: number;
    childrenPrice: number;
    form1 = true;
    form2 = false;
    username: String;
    idUser: String;
    text: String;
    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }

    constructor(
        private completerService: CompleterService,
        private fb: FormBuilder,
        protected ref: NbDialogRef<AddCustomerComponent>,
        private contractService: ContractService,
    ) {
        console.log('custom');
        this.getTour();
        this.dataService = completerService.local(this.objUser, 'username', 'username');
    }

    ngOnInit() {
        this.form = this.fb.group({
            representative: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            username: [null, Validators.compose([Validators.required])],
            tour: [null, Validators.compose([Validators.required])],
            text: [null, Validators.compose([Validators.required])],
            adult: [null, Validators.compose([Validators.required])],

            contacts: this.fb.array([this.createContact()]),
        });
        this.contactList = this.form.get('contacts') as FormArray;
    }

    // part customer
    createContact(): FormGroup {
        this.price = 0;
        try {
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
                address: [null, Validators.compose([Validators.required])],
                gender: [null, Validators.compose([Validators.required])],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContact() {
        this.contactList.push(this.createContact());
    }

    async removeContact(index) {
        let data = this.form.value;
        if (this.price > 0) {
            let currentDay = moment(Date()).format('YYYY/MM/DD');
            let firstDate = moment(currentDay);
            let secondDate = moment(data.contacts[index].birthday).format('YYYY/MM/DD');
            let diffInDays = Math.abs(firstDate.diff(secondDate, 'year'));
            if (diffInDays > 5) this.price -= data.tour.adultPrice;
            else {
                this.price -= data.tour.childrenPrice;
            }
        }
        this.contactList.removeAt(index);
    }

    getContactsFormGroup(index): FormGroup {
        const formGroup = this.contactList.controls[index] as FormGroup;
        return formGroup;
    }
    // part customer
    // form
    dismiss() {
        this.ref.close();
    }
    async checkForm2() {
        this.form1 = false;
        this.form2 = true;
        let i = await this.contractService.getUser();
        console.log(i);
        i.map(data => {
            this.objUser.push({
                id: data.id,
                username: data.get('username'),
                phone: data.get('phone'),
                fullname: data.get('fullname'),
                email: data.get('email'),
            });
        });
    }
    infoUser(event) {
        try {
            if (event) {
                this.form = this.fb.group({
                    representative: [event.originalObject.fullname],
                    phone: [event.originalObject.phone],
                    email: [null],
                    text: [event.originalObject.username],
                    username: [null, Validators.compose([Validators.required])],
                    tour: [null, Validators.compose([Validators.required])],
                    contacts: this.fb.array([this.createContact()]),
                });
                this.contactList = this.form.get('contacts') as FormArray;
            }
            this.idUser = event.originalObject.id;
            this.text = event.originalObject.username;
        } catch (ex) {
            console.log(ex);
        }
    }
    // form
    async getTour() {
        let result = await this.contractService.getTour();
        for (let i of result) {
            this.tour.push({
                id: i.id,
                code: i.get('code'),
                startDay: i.get('startDay'),
                endDay: i.get('endDay'),
                childrenPrice: i.get('childrenPrice'),
                adultPrice: i.get('adultPrice'),
            });
        }
    }
    async checkQuantity() {}
    getDay(i) {
        this.adultPrice = this.tour[i].adultPrice;
        this.childrenPrice = this.tour[i].childrenPrice;
    }
    async checkUser(user) {
        let i = await this.contractService.checkUser(user);
        if (i.length > 0) {
            this.existUser = 'That username is already taken. Try another';
        } else {
            this.existUser = '';
        }
    }
    async pay() {}
    submit() {
        this.submitted = true;
        console.log(this.existUser);
        if (this.form.invalid) {
            return;
        } else {
            this.ref.close({
                info: this.form.value,
                idUser: this.idUser,
                price: this.price,
            });
        }
    }
}
