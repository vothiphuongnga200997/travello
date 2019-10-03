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
    createContact(): FormGroup {
        return this.fb.group({
            type: ['email', Validators.compose([Validators.required])],
            name: [null, Validators.compose([Validators.required])],
            value: [null, Validators.compose([Validators.required, Validators.email])],
        });
    }
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            name: [null, Validators.compose([Validators.required])],
            organization: [null],
            contacts: this.fb.array([this.createContact()]),
        });
    }
}
