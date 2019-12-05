import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService } from 'ng2-completer';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer.component';
import { ContractService } from '../../../shared/services/contract.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TourService } from '../../../shared/services/tour.service';
import * as Parse from 'parse';

@Component({
    selector: 'edit-contract',
    templateUrl: './edit.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class EditContractComponent implements OnInit {
    title: string;
    idEdit: string;
    protected dataService: CompleterData;
    objUser: Array<any> = [];
    objCustomEdit: Array<any> = [];
    empty: any; // so luong con trong cua tour;
    submitted = false;
    public form1: FormGroup;
    public contactList: FormArray;
    public surchargeList: FormArray;

    tour: Array<any> = [];
    startDay: any;
    endDay: any;
    existUser: String;
    birthday: any;
    price: number = 0;
    objTour: String;
    adultPrice: number;
    childrenPrice: number;
    username: String;
    idUser: String;
    text: String;
    numberAdult: number = 0;
    numberKids: number = 0;
    money: number;
    saleoff: number;
    checked: boolean;
    quantity: number; // so luong cho trong tour
    addAdult: number = 0;
    addKids: number = 0;
    fullQuantity: string;
    paidOfCustomer: any;
    priceOld: number;
    idCustomer: any;
    discount: number;
    member: string;
    get contactFormGroup() {
        return this.form1.get('contacts') as FormArray;
    }
    get surchargeFormGroup() {
        return this.form1.get('surcharge') as FormArray;
    }
    constructor(
        private completerService: CompleterService,
        private fb: FormBuilder,
        protected ref: NbDialogRef<AddCustomerComponent>,
        private contractService: ContractService,
        private modalService: NgbModal,
        private tourService: TourService,
    ) {
        this.getTour();
        this.dataService = completerService.local(this.objUser, 'username', 'username');
    }

    async ngOnInit() {
        let result = await this.contractService.getContractId(this.idEdit);
        if (result) {
            let schedule = await this.tourService.querySchedule(result.get('objSchedule').id);
            this.objCustomEdit = result.attributes.infoCustom;
            this.idUser = result.attributes.objUser.id;
            this.price = result.attributes.price;
            this.priceOld = result.attributes.price;
            this.form1 = this.fb.group({
                representative: [result.attributes.objUser.attributes.fullname],
                phone: [result.attributes.objUser.attributes.phone],
                username: [result.attributes.objUser.attributes.username],
                tour: [schedule.id],
                idUser: [result.attributes.objUser],
                adult: [result.attributes.numberAdult],
                kids: [result.attributes.numberKids],
                paid: [result.attributes.paid],
                contacts: this.fb.array([]),
                surcharge: this.fb.array([]),
            });
            this.startDay = moment(schedule.attributes.startDay).format('HH:mm DD/MM/YYYY');
            this.endDay = moment(schedule.attributes.endDay).format('HH:mm DD/MM/YYYY');
            this.adultPrice = schedule.attributes.objTour.attributes.adultPrice;
            this.childrenPrice = schedule.attributes.objTour.attributes.childrenPrice;
            this.saleoff = schedule.attributes.objTour.attributes.saleoff;
            this.empty = schedule.attributes.empty;
            this.quantity = schedule.attributes.objTour.attributes.quantity;
            this.numberAdult = result.attributes.numberAdult;
            this.numberKids = result.attributes.numberKids;
            this.contactList = this.form1.get('contacts') as FormArray;
            this.surchargeList = this.form1.get('surcharge') as FormArray;
            for (let i of schedule.attributes.surcharge) {
                try{}catch(ex){
                    console.log(ex)
                }
            }
            for (let i of this.objCustomEdit) {
                try {
                    this.contactList.push(
                        this.fb.group({
                            name: [i.name],
                            phonecustomer: [i.phonecustomer],
                            address: [i.address],
                            gender: [i.gender],
                            type: [i.type],
                        }),
                    );
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
    }

    getContactsFormGroup(index): FormGroup {
        const formGroup = this.contactList.controls[index] as FormGroup;
        return formGroup;
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
    selectedTour(i) {
        this.startDay = moment(this.tour[i].startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(this.tour[i].endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = this.tour[i].adultPrice;
        this.childrenPrice = this.tour[i].childrenPrice;
        this.saleoff = this.tour[i].saleoff;
        this.empty = this.tour[i].empty;
        this.quantity = this.tour[i].quantity;
        this.pay();
    }
    async pay() {
        this.price = 0;

        if (this.form1.value.idUser) {
            const custom = Parse.Object.extend('customer');
            const query = new Parse.Query(custom);
            query.select('paid', 'member');
            query.equalTo('objUser', this.form1.value.idUser);
            let result = await query.first();
            if (result) {
                this.paidOfCustomer = result.attributes.paid - this.priceOld;
                this.idCustomer = result.id;
                if (result.attributes.paid >= 100000000) {
                    this.discount = 0.1;
                    this.member = 'Khách hàng VIP';
                } else {
                    if (50000000 <= result.attributes.paid && 100000000 > result.attributes.paid) this.discount = 0.05;
                    else {
                        this.discount = 0;
                        this.member = 'Khách hàng thân thiện';
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
    infoUser(event) {
        try {
            this.idUser = event.originalObject.id;
            this.text = event.originalObject.username;
        } catch (ex) {
            console.log(ex);
        }
    }
    async submit() {
        this.submitted = true;
        if (this.form1.invalid) {
            return;
        } else {
            await this.pay();
            this.ref.close({
                id: this.idEdit,
                info: this.form1.value,
                price: this.price,
                quantity: this.quantity,
                paidOfCuctomer: this.paidOfCustomer,
                idCustomer: this.idCustomer,
            });
        }
    }
    dismiss() {
        this.ref.close();
    }
    createContactAdult(): FormGroup {
        this.pay();
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
        this.pay();
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
}