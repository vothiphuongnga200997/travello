import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    name = '';
    email = '';
    employee = '';
    constructor() {}

    ngOnInit() {}
}
