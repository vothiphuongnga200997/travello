import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    submitted = false;
    public form: FormGroup;
    public contactList: FormArray;
    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }
    constructor(private fb: FormBuilder) {
        console.log('custom');
    }

    ngOnInit() {
        this.form = this.fb.group({
            representative: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required])],
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            username: [null, Validators.compose([Validators.required])],
            contacts: this.fb.array([this.createContact()]),
        });
        this.contactList = this.form.get('contacts') as FormArray;
    }
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

    submit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }
        console.log(this.form.value);
    }
}
