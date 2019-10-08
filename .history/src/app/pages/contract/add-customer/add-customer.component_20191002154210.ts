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
            a3: 100,
            a4: Date,
        },
    ];
    title: string;
    registerForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            fullname: ['', Validators.required],
            phone: ['', Validators.required],
            birthday: ['', Validators.required],
            address: ['', Validators.required],
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
            a3: 100,
            a4: Date,
        });
    }
    removeInfo(i: number) {
        this.info.splice(i, 1);
    }

    logValue() {
        console.log(this.info);
    }
}
