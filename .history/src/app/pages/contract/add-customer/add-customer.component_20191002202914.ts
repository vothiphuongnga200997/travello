import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    title: string;
    registerForm: FormGroup;
    address: string;
    fullName: string;
    phone: number;
    birthday: Date;

    submitted = false;
    public info: any[] = [
        {
            a1: '',
            a2: null,
            a3: '',
            a4: null,
        },
    ];
    constructor(private formBuilder: FormBuilder) {
        console.log('addcustom');
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            birthday: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
        });
    }
    get f() {
        return this.registerForm.controls;
    }

    addInfo() {
        this.info.push({
            a1: '',
            a2: null,
            a3: '',
            a4: null,
        });
    }
    removeInfo(i: number) {
        this.info.splice(i, 1);
    }

    logValue() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        console.log(this.info);
    }
}
