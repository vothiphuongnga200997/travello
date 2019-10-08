import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../../shared/services/contract.service';
import { from } from 'rxjs';
@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    title: String;
    submitted = false;
    public form: FormGroup;
    public contactList: FormArray;
    tour: Array<any> = [];
    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }
    constructor(private fb: FormBuilder, protected ref: NbDialogRef<AddCustomerComponent>, private contractService: ContractService) {
        console.log('custom');
        this.getTour();
    }

    ngOnInit() {
        this.form = this.fb.group({
            representative: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required, Validators.email])],
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            username: [null, Validators.compose([Validators.required])],
            tour: [null, Validators.compose([Validators.required])],
            contacts: this.fb.array([this.createContact()]),
        });
        this.contactList = this.form.get('contacts') as FormArray;
    }

    // part customer
    createContact(): FormGroup {
        return this.fb.group({
            name: [null, Validators.compose([Validators.required])],
            phonecustomer: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            address: [null, Validators.compose([Validators.required])],
            birthday: [null, Validators.compose([Validators.required])],
        });
    }
    addContact() {
        this.contactList.push(this.createContact());
    }

    removeContact(index) {
        this.contactList.removeAt(index);
    }

    getContactsFormGroup(index): FormGroup {
        const formGroup = this.contactList.controls[index] as FormGroup;
        return formGroup;
    }
    // part customer

    dismiss() {
        this.ref.close();
    }

    async getTour() {
        let result = await this.contractService.getTour();
        for (let i of result) {
            this.tour.push({
                id: i.id,
                code: i.get('code'),
                startDay: i.get('startDay'),
                endDay: i.get('endDay'),
            });
        }
        console.log(this.tour);
    }

    getDay(i) {
        // let startDay = this.tour.startDay;
    }
    submit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }
        console.log(this.form.value);
    }
}
