import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    hinh: any;
    constructor() {
        console.log(this.hinh);
    }

    ngOnInit() {}
    lick() {
        console.log(this.hinh);
    }
}
