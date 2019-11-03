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
    menber: string;
    paidOfCustomer: number = 0; // tong so tien da co cua khach hang trong lớp customer
    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
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
            tour: [null, Validators.compose([Validators.required])],
            idUser: [''],
            adult: [0, Validators.compose([Validators.required, Validators.min(1)])],
            kids: [0],
            paid: [0],
            contacts: this.fb.array([]),
        });
        this.contactList = this.form.get('contacts') as FormArray;
    }

    // part customer
    createContactAdult(): FormGroup {
        this.price = 0;

        try {
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

        try {
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
    addTicket() {
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
            this.pay();
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
        this.pay();
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
                    tour: [null, Validators.compose([Validators.required])],
                    adult: [0, Validators.compose([Validators.required, Validators.min(1)])],
                    kids: [0],
                    paid: [0],
                    contacts: this.fb.array([]),
                });
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
            this.tour.push({
                id: i.id,
                code: i.get('codeSchedule'),
                startDay: i.get('startDay'),
                endDay: i.get('endDay'),
                childrenPrice: i.get('objTour').get('childrenPrice'),
                adultPrice: i.get('objTour').get('adultPrice'),
                saleoff: i.get('objTour').get('saleoff'),
                empty: i.get('empty'),
                quantity: i.get('objTour').get('quantity'),
            });
        }
    }
    async checkQuantity() {}
    selectedTour(i) {
        this.price = 0;
        this.startDay = moment(this.tour[i].startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(this.tour[i].endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = this.tour[i].adultPrice;
        this.childrenPrice = this.tour[i].childrenPrice;
        this.saleoff = this.tour[i].saleoff;
        this.empty = this.tour[i].empty;
        this.quantity = this.tour[i].quantity;
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
    async pay() {
        this.price = 0;
        console.log(this.form.value);
        if (this.form.value.idUser) {
            const custom = Parse.Object.extend('customer');

            const query = new Parse.Query(custom);
            query.select('paid', 'member');
            query.equalTo('objUser', this.form.value.idUser);
            let result = await query.first();
            if (result) {
                this.paidOfCustomer = result.attributes.paid;
                if (result.attributes.paid >= 100000000) {
                    this.discount = 0.1;
                    this.menber = 'Khách hàng VIP';
                } else {
                    if (50000000 <= result.attributes.paid && 100000000 > result.attributes.paid) this.discount = 0.05;
                    else {
                        this.discount = 0;
                        this.menber = 'Khách hàng thân thiện';
                    }
                }
            }
        }
        if (this.saleoff === null) this.saleoff = 0;
        this.price =
            this.numberAdult * this.adultPrice +
            this.numberKids * this.childrenPrice -
            this.numberAdult * this.saleoff -
            (this.numberAdult * this.adultPrice + this.numberKids * this.childrenPrice - this.numberAdult * this.saleoff) * this.discount;
        console.log(this.price);
    }
    async submit() {
        this.submitted = true;
        console.log(this.existUser);
        console.log(this.form.value);
        if (this.form.invalid) {
            return;
        } else {
            await this.pay();
            console.log(this.price);
            this.ref.close({
                info: this.form.value,
                price: this.price,
                empty: this.empty,
                quantity: this.quantity,
                paidOfCuctomer: this.paidOfCustomer,
            });
        }
    }
}
