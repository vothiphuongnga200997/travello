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
            a1: this.fullName,
            a2: this.birthday,
            a3: this.address,
            a4: this.phone,
        },
    ];
    constructor(private formBuilder: FormBuilder) {}

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
        this.fullName = '';
        this.birthday = '';
        this.address = '';
        this.phone = '';
        this.info.push({
            a1: this.fullName,
            a2: this.birthday,
            a3: this.address,
            a4: this.phone,
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
