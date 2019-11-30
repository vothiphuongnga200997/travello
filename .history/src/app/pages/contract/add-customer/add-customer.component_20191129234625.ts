import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NumberValueAccessor } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../../shared/services/contract.service';
import * as moment from 'moment';
import { CompleterData, CompleterService } from 'ng2-completer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    protected dataService: CompleterData;
    private modalRef;
    objUser: Array<any> = [];
    objCustomEdit: Array<any> = [];
    title: String;
    idEdit: any;
    empty: any; // so luong con trong cua tour;
    submitted = false;
    public form: FormGroup;
    public contactList: FormArray;
    public surchargeList: FormArray;
    schedule: Array<any> = [];
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
    numberAdult: number = 0; // SO LUONG VE
    numberKids: number = 0; // SO LUONG VE
    isshow1: boolean = true;
    isshow2: boolean = false;
    checked: boolean = false;
    money: number;
    saleoff: number;
    quantity: number; // so luong cho cua tour
    addAdult: number = 0; // them ve nguoi lon
    addKids: number = 0; // them ve tre em
    IsmodelShow: boolean = true;
    fullQuantity: string;
    disabled = '';
    discount: number = 0;
    sumMoney: number = 0;
    member: string;
    paidOfCustomer: number = 0; // tong so tien da co cua khach hang trong lớp customer
    idCustomer: '';
    priceSurcharge: number;
    listSurcharge: any[];
    priceSA: number = 0;
    priceSC: number = 0;
    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }
    get surchargeFormGroup() {
        return this.form.get('surcharge') as FormArray;
    }
    constructor(
        private completerService: CompleterService,
        private fb: FormBuilder,
        protected ref: NbDialogRef<AddCustomerComponent>,
        private contractService: ContractService,
        private modalService: NgbModal,
    ) {
        this.getTour();
        this.dataService = completerService.local(this.objUser, 'username', 'username');
    }

    async ngOnInit() {
        this.form = this.fb.group({
            representative: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            username: [null, Validators.compose([Validators.required])],
            idSchedule: [null, Validators.compose([Validators.required])],
            idUser: [''],
            adult: [0, Validators.compose([Validators.required, Validators.min(1)])],
            kids: [0],
            paid: [0],
            contacts: this.fb.array([]),
            surcharge: this.fb.array([]),
        });
        this.contactList = this.form.get('contacts') as FormArray;
        this.surchargeList = this.form.get('surcharge') as FormArray;
    }

    // part customer
    createContactAdult(): FormGroup {
        try {
            this.pay();
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
                address: [null, Validators.compose([Validators.required])],
                gender: [null, Validators.compose([Validators.required])],
                type: ['Người lớn'],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    createContactKids(): FormGroup {
        this.price = 0;
        this.sumMoney = 0;

        try {
            this.pay();
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
                address: [null, Validators.compose([Validators.required])],
                gender: [null, Validators.compose([Validators.required])],
                type: ['Trẻ em'],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    async addInfo() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        } else {
            this.submitted = false;
            if (this.empty > this.numberAdult + this.numberKids) {
                for (let i = 0; i < this.numberAdult; i++) {
                    await this.contactList.push(this.createContactAdult());
                    this.empty--;
                }
                for (let i = 0; i < this.numberKids; i++) {
                    await this.contactList.push(this.createContactKids());
                    this.empty--;
                }
                this.isshow1 = false;
                this.isshow2 = true;
                this.fullQuantity = '';
                this.disabled = 'null';
            } else {
                return (this.fullQuantity = 'Số lượng bạn chọn vượt quá số chổ còn lại!!');
            }
        }
    } // dung cho ham them thong tin
    async addTicket() {
        if (this.empty > this.numberAdult + this.addAdult + this.addKids + this.numberKids) {
            for (let i = 0; i < this.addAdult; i++) {
                this.contactList.push(this.createContactAdult());
                this.numberAdult++;
                this.empty--;
            }
            for (let i = 0; i < this.addKids; i++) {
                this.contactList.push(this.createContactKids());
                this.numberKids++;
                this.empty--;
            }
            await this.pay();
        } else {
            return (this.fullQuantity = 'Số lượng vượt quá số lượng còn lại! Bạn vui lòng kiểm tra lại.');
        }
    } // dung cho them ve
    openVerticallyCentered(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(result => {
            this.addTicket();
        });
    }

    async removeContact(index) {
        if (this.form.value.contacts[index].type === 'Người lớn') {
            this.numberAdult--;
        } else {
            if (this.form.value.contacts[index].type === 'Trẻ em') this.numberKids--;
        }
        this.contactList.removeAt(index);
        await this.pay();
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
        i.map(data => {
            this.objUser.push({
                obj: data,
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
                    idUser: [event.originalObject.obj],
                    idSchedule: [null, Validators.compose([Validators.required])],
                    adult: [0, Validators.compose([Validators.required, Validators.min(1)])],
                    kids: [0],
                    paid: [0],
                    contacts: this.fb.array([]),
                    surcharge: this.fb.array([]),
                });
                this.surchargeList = this.form.get('surcharge') as FormArray;
                this.contactList = this.form.get('contacts') as FormArray;
            }
            this.text = event.originalObject.username;
        } catch (ex) {
            console.log(ex);
        }
    }
    // form
    async getTour() {
        let result = await this.contractService.getSchedule();
        for (let i of result) {
            this.schedule.push({
                id: i.id,
                code: i.get('codeSchedule'),
                startDay: i.get('startDay'),
                endDay: i.get('endDay'),
                childrenPrice: i.get('objTour').get('childrenPrice'),
                adultPrice: i.get('objTour').get('adultPrice'),
                saleoff: i.get('objTour').get('saleoff'),
                empty: i.get('empty'),
                quantity: i.get('objTour').get('quantity'),
                surcharge: i.get('objTour').get('surcharge'),
                priceSA: i.get('objTour').get('adultPrice') - i.get('objTour').get('saleoff'),
                priceSC: i.get('objTour').get('childrenPrice') - i.get('objTour').get('saleoff'),
            });
        }
    }
    async checkQuantity() {}
    selectedTour(i) {
        this.price = 0;
        this.sumMoney = 0;
        this.startDay = moment(this.schedule[i].startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(this.schedule[i].endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = this.schedule[i].adultPrice;
        this.childrenPrice = this.schedule[i].childrenPrice;
        this.saleoff = this.schedule[i].saleoff;
        this.empty = this.schedule[i].empty;
        this.quantity = this.schedule[i].quantity;
        for (let data of this.schedule[i].surcharge) {
            this.surchargeList.push(
                this.fb.group({
                    type: [data.type],
                    price: [data.price],
                    quantity: [0, Validators.compose([Validators.required, Validators.min(0)])],
                }),
            );
        }

        this.pay();
    }
    async checkUser(user) {
        let i = await this.contractService.checkUser(user);
        if (i.length > 0) {
            this.existUser = 'That username is already taken. Try another';
        } else {
            this.existUser = '';
        }
    }
    checkPrice() {
        for (let data of this.form.value.surcharge) {
            this.priceSurcharge = 0;
            this.listSurcharge = [];
            if (data.quantity > 0) {
                this.priceSurcharge += data.quantity * data.price;
            }
            this.listSurcharge.push(data);
        }
        console.log(this.listSurcharge);
        this.pay();
    }
    async pay() {
        this.price = 0;
        this.sumMoney = 0;
        if (this.form.value.idUser) {
            const custom = Parse.Object.extend('customer');

            const query = new Parse.Query(custom);
            query.equalTo('objUser', this.form.value.idUser);
            let result = await query.first();
            if (result) {
                this.paidOfCustomer = result.attributes.paid;
                this.idCustomer = result.id;
                this.discount = result.attributes.discount;
                if (this.discount === 0.1) {
                    this.member = 'Khách hàng VIP';
                } else {
                    if (this.discount === 0.05) {
                        this.member = 'Khách hàng thân thiện';
                    }
                }
            }
        }
        if (this.saleoff === null) this.saleoff = 0;
        this.price = this.numberAdult * this.adultPrice + this.numberKids * this.childrenPrice;
        this.sumMoney =
            this.numberAdult * this.adultPrice +
            this.numberKids * this.childrenPrice -
            this.numberAdult * this.saleoff -
            (this.numberAdult * this.adultPrice + this.numberKids * this.childrenPrice - this.numberAdult * this.saleoff) * this.discount;
    }
    async submit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        } else {
            await this.pay();
            this.ref.close({
                info: this.form.value,
                price: this.price,
                empty: this.empty,
                quantity: this.quantity,
                paidOfCuctomer: this.paidOfCustomer,
                idCustomer: this.idCustomer,
            });
        }
    }
}
