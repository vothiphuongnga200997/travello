import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    public info: any[] = [
        {
            birthday: Date,
            phone: Number(),
            address: '',
            fullname: '',
        },
    ];
    public info1 = [
        {
            a1: '',
            a2: '',
            // phone: this.phone,
            a4: Date,
        },
    ];
    title: string;
    registerForm: FormGroup;
    email: string;
    fullName: string;
    phone: number;
    date: Date;

    submitted = false;
    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            birthday: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            phone: ['', Validators.required],
        });
    }
    get f() {
        return this.registerForm.controls;
    }
    addInfo() {
        this.info.push({
            fullname: String,
            birthday: Date,
            phone: Number(),
            address: String,
        });
    }
    addInfo1() {
        this.info1.push({
            a1: '',
            a2: '',
            // phone: this.phone,
            a4: Date,
        });
    }
    removeInfo(i: number) {
        this.info.splice(i, 1);
    }
    removeInfo1(i: number) {
        this.info1.splice(i, 1);
    }
    logValue() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        // console.log(this.info1);
    }
}
