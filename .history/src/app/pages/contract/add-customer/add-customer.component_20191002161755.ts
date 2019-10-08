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
    phone: number;
    public info1 = [
        {
            a1: '',
            a2: '',
           this.number,
            a4: Date,
        },
    ];
    title: string;
    registerForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {}
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
            a3: any,
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
        console.log(this.info);
    }
}
