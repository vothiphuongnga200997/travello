import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../../shared/services/contract.service';
import * as moment from 'moment';
import { CompleterData, CompleterService } from 'ng2-completer';
@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    protected dataService: CompleterData;
    objUser: Array<any> = [];
    objCustomEdit: Array<any> = [];
    title: String;
    idEdit: any;
    empty: any; // so luong con trong cua tour;
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
    numberAdult: number = 0;
    numberkids: number = 0;
    checked: boolean = false;
    money: number;
    saleoff: number;
    quantity: number; // so luong cho cua tour
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

    async ngOnInit() {
        this.form = this.fb.group({
            representative: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            username: [null, Validators.compose([Validators.required])],
            tour: [null, Validators.compose([Validators.required])],
            adult: [0, Validators.compose([Validators.required, Validators.min(1)])],
            kids: [0],
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
                type: [null, Validators.compose([Validators.required])],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContact() {
        this.contactList.push(this.createContact());
    }

    async removeContact(index) {
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
                    username: [event.originalObject.username],
                    email: [event.originalObject.email],
                    tour: [null, Validators.compose([Validators.required])],
                    adult: [null, Validators.compose([Validators.required])],
                    kids: [null],
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
                saleoff: i.get('saleoff'),
                empty: i.get('empty'),
                quantity: i.get('quantity'),
            });
        }
        console.log(this.tour);
    }
    async checkQuantity() {}
    selectedTour(i) {
        this.startDay = moment(this.tour[i].startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(this.tour[i].endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = this.tour[i].adultPrice;
        this.childrenPrice = this.tour[i].childrenPrice;
        this.saleoff = this.tour[i].saleoff;
        this.empty = this.tour[i].empty;
        this.quantity = this.tour[i].quantity;
    }
    async checkUser(user) {
        let i = await this.contractService.checkUser(user);
        if (i.length > 0) {
            this.existUser = 'That username is already taken. Try another';
        } else {
            this.existUser = '';
        }
    }
    async pay() {
        this.price = 0;
        if (this.form.value.adult === null) this.form.value.adult = 0;
        if (this.form.value.kids === null) this.form.value.kids = 0;
        this.price =
            this.form.value.adult * this.adultPrice + this.form.value.kids * this.childrenPrice - this.form.value.adult * this.saleoff;
        console.log(this.price);
    }
    submit() {
        this.submitted = true;
        console.log(this.existUser);
        if (this.form.invalid) {
            return;
        } else {
            this.pay();
            this.ref.close({
                info: this.form.value,
                idUser: this.idUser,
                price: this.price,
                empty: this.empty,
                quantity: this.quantity,
            });
        }
    }
}
