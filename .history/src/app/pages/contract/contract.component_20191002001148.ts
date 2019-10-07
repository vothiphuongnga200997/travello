import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    public addresses: any[] = [
        {
            address: '',
            street: '',
            city: '',
            country: '',
        },
    ];
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
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