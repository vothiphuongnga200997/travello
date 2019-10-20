import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService } from 'ng2-completer';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer.component';
import { ContractService } from '../../../shared/services/contract.service';
import * as moment from 'moment';

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
    username: String;
    idUser: String;
    text: String;
    numberAdult: number = 0;
    numberkids: number = 0;
    money: number;
    saleoff: number;
    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }
    constructor(
        private completerService: CompleterService,
        private fb: FormBuilder,
        protected ref: NbDialogRef<AddCustomerComponent>,
        private contractService: ContractService,
    ) {
        this.getTour();
        this.dataService = completerService.local(this.objUser, 'username', 'username');
    }

    async ngOnInit() {
        let result = await this.contractService.getContractId(this.idEdit);
        this.objCustomEdit = result[0].attributes.infoCustom;
        this.idUser = result[0].attributes.objUser.id;
        this.price = result[0].attributes.price;
        this.form = this.fb.group({
            representative: [result[0].attributes.objUser.attributes.fullname],
            phone: [result[0].attributes.objUser.attributes.phone],
            email: [null],
            username: [result[0].attributes.objUser.attributes.username],
            tour: [result[0].attributes.objTour.id],
            adult: [result[0].attributes.numberAdult],
            kids: [result[0].attributes.numberKids],
            contacts: this.fb.array([]),
        });
        this.startDay = moment(result[0].attributes.objTour.attributes.startDay).format('HH:mm DD/MM/YYYY');
        this.endDay = moment(result[0].attributes.objTour.attributes.endDay).format('HH:mm DD/MM/YYYY');
        this.adultPrice = result[0].attributes.objTour.attributes.adultPrice;
        this.childrenPrice = result[0].attributes.objTour.attributes.childrenPrice;
        this.saleoff = result[0].attributes.objTour.attributes.saleoff;
        this.empty = result[0].attributes.objTour.attributes.empty;
        this.contactList = this.form.get('contacts') as FormArray;
        for (let i of this.objCustomEdit) {
            try {
                this.contactList.push(
                    this.fb.group({
                        name: [i.name],
                        phonecustomer: [i.phonecustomer],
                        address: [i.address],
                        gender: [i.gender],
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
    }
    async pay() {
        this.price = 0;
        if (this.form.value.adult === null) this.form.value.adult = 0;
        if (this.form.value.kids === null) this.form.value.kids = 0;
        this.price =
            this.form.value.adult * this.adultPrice + this.form.value.kids * this.childrenPrice - this.form.value.adult * this.saleoff;
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
        if (this.form.invalid) {
            return;
        } else {
            this.ref.close({
                info: this.form.value,
                idUser: this.idUser,
                price: this.price,
                empty: this.empty,
            });
        }
    }
    dismiss() {
        this.ref.close();
    }
}
