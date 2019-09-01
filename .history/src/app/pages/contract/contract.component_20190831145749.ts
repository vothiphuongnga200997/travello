import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    redirectDelay: number;
    showMessages: any;
    strategy: string;
    submitted: boolean;
    errors: string[];
    messages: string[];
    user: any;
    name = '';
    email = '';
    employee = '';
    constructor() {}
    register(): void;
    ngOnInit() {}
}
