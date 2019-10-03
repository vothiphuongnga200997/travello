import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    submited = false;
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
            type: ['email', Validators.compose([Validators.required])], // i.e Email, Phone
            name: [null, Validators.compose([Validators.required])], // i.e. Home, Office
            value: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[0-9]+'), // pattern for validating international phone number
                ]),
            ],
            phone: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(new RegExp('^\\+[0-9]?()[0-9](\\d[0-9]{9})$')), // pattern for validating international phone number
                ]),
            ],
        });
        this.contactList = this.form.get('contacts') as FormArray;
    }
    createContact(): FormGroup {
        return this.fb.group({
            type: ['email', Validators.compose([Validators.required])], // i.e Email, Phone
            name: [null, Validators.compose([Validators.required])], // i.e. Home, Office
            value: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('[0-9]+'), // pattern for validating international phone number
                ]),
            ],
            phone: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(new RegExp('^\\+[0-9]?()[0-9](\\d[0-9]{9})$')), // pattern for validating international phone number
                ]),
            ],
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
        this.submited = true;
        console.log(this.form.value);

        if (this.form.invalid) {
            return;
        }
    }
}
