import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService } from 'ng2-completer';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer.component';
import { ContractService } from '../../../shared/services/contract.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    numberkids: number = 0;
    money: number;
    saleoff: number;
    checked: boolean;
    quantity: number; // so luong cho trong tour
    addAdult: number;
    addKids: number;
    fullQuantity: string;
    get contactFormGroup() {
        return this.form1.get('contacts') as FormArray;
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
        this.form1 = this.fb.group({
            representative: [null, Validators.compose([Validators.required])],
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            username: [null, Validators.compose([Validators.required])],
            tour: [null, Validators.compose([Validators.required])],
            adult: [null, Validators.compose([Validators.required, Validators.min(0)])],
            kids: [null],
            paid: [null],
            contacts: this.fb.array([]),
        });
        let result = await this.contractService.getContractId(this.idEdit);
        this.objCustomEdit = result[0].attributes.infoCustom;
        this.idUser = result[0].attributes.objUser.id;
        this.price = result[0].attributes.price;
        this.form1 = this.fb.group({
            representative: [result[0].attributes.objUser.attributes.fullname],
            phone: [result[0].attributes.objUser.attributes.phone],
            username: [result[0].attributes.objUser.attributes.username],
            tour: [result[0].attributes.objTour.id],
            adult: [result[0].attributes.numberAdult],
            kids: [result[0].attributes.numberKids],
            paid: [result[0].attributes.paid],
            contacts: this.fb.array([]),
        });
        this.startDay = moment(result[0].attributes.objTour.attributes.startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(result[0].attributes.objTour.attributes.endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = result[0].attributes.objTour.attributes.adultPrice;
        this.childrenPrice = result[0].attributes.objTour.attributes.childrenPrice;
        this.saleoff = result[0].attributes.objTour.attributes.saleoff;
        this.empty = result[0].attributes.objTour.attributes.empty;
        this.quantity = result[0].attributes.objTour.attributes.quantity;
        this.numberAdult = result[0].attributes.numberAdult;
        this.numberkids = result[0].attributes.numberKid;
        this.contactList = this.form1.get('contacts') as FormArray;
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

    getContactsFormGroup(index): FormGroup {
        const formGroup = this.contactList.controls[index] as FormGroup;
        return formGroup;
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
    }
    selectedTour(i) {
        this.startDay = moment(this.tour[i].startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(this.tour[i].endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = this.tour[i].adultPrice;
        this.childrenPrice = this.tour[i].childrenPrice;
        this.saleoff = this.tour[i].saleoff;
        this.empty = this.tour[i].empty;
        this.quantity = this.tour[i].quantity;
    }
    async pay() {
        this.price = 0;
        if (this.form1.value.adult === null) this.form1.value.adult = 0;
        if (this.form1.value.kids === null) this.form1.value.kids = 0;
        this.price =
            this.form1.value.adult * this.adultPrice + this.form1.value.kids * this.childrenPrice - this.form1.value.adult * this.saleoff;
    }
    infoUser(event) {
        try {
            this.idUser = event.originalObject.id;
            this.text = event.originalObject.username;
        } catch (ex) {
            console.log(ex);
        }
    }
    submit() {
        this.submitted = true;
        console.log(this.existUser);
        if (this.form1.invalid) {
            return;
        } else {
            this.ref.close({
                id: this.idEdit,
                info: this.form1.value,
                idUser: this.idUser,
                price: this.price,
                quantity: this.quantity,
            });
        }
    }
    dismiss() {
        this.ref.close();
    }
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
    addTicket() {
        if (this.empty > this.numberAdult + this.addAdult + this.addKids + this.numberkids) {
            for (let i = 0; i < this.addAdult; i++) {
                this.contactList.push(this.createContactAdult());
                this.numberAdult++;
                this.empty--;
            }
            for (let i = 0; i < this.addKids; i++) {
                this.contactList.push(this.createContactKids());
                this.numberkids++;
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
