import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    public addresses: any[] = [
        {
            address: '',
            street: '',
            city: '',
            country: '',
        },
    ];
    constructor() {}

    ngOnInit() {}
    addAddress() {
        this.addresses.push({
            address: '',
            street: '',
            city: '',
            country: '',
        });
    }
    removeAddress(i: number) {
        this.addresses.splice(i, 1);
    }

    logValue() {
        console.log(this.addresses);
    }
}
