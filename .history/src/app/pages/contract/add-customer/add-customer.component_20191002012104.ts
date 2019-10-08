import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    public info: any[] = [
        {
            fullName: String,
            birthday: Date,
            phone: Number,
            address: String,
        },
    ];
    title: string;
    constructor() {}

    ngOnInit() {}

    addAddress() {
        this.info.push({
            address: '',
            street: '',
            city: '',
            country: '',
        });
    }
    removeAddress(i: number) {
        this.info.splice(i, 1);
    }

    logValue() {
        console.log(this.info);
    }
}
