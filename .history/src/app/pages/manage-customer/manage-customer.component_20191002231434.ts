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
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            name: [null, Validators.compose([Validators.required])],
            organization: [null],
            contacts: this.fb.array([this.createContact()]),
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

    // remove contact from group
    removeContact(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.contactList.removeAt(index);
    }

    // triggered to change validation of value field type
    changedFieldType(index) {
        let validators = null;

        if (this.getContactsFormGroup(index).controls['type'].value === 'email') {
            validators = Validators.compose([Validators.required, Validators.email]);
        } else {
            validators = Validators.compose([
                Validators.required,
                Validators.pattern(new RegExp('^\\+[0-9]?()[0-9](\\d[0-9]{9})$')), // pattern for validating international phone number
            ]);
        }

        this.getContactsFormGroup(index).controls['value'].setValidators(validators);

        this.getContactsFormGroup(index).controls['value'].updateValueAndValidity();
    }

    getContactsFormGroup(index): FormGroup {
        const formGroup = this.contactList.controls[index] as FormGroup;
        return formGroup;
    }

    submit() {
        this.submited = true;
        if (this.form.invalid) {
            return;
        }
        console.log(this.form.value);
    }
}
