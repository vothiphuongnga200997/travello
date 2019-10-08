import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
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
            value: [null, Validators.compose([Validators.required, Validators.email])],
        });
    }
}
