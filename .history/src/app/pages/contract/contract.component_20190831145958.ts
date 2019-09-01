import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export declare class ContractComponent implements OnInit {
    redirectDelay: number;
    showMessages: any;
    strategy: string;
    submitted: boolean;
    errors: string[];
    messages: string[];
    user: any;
    name: string;
    email: string;
    employee: string;
    constructor() {}
    ngOnInit() {}
    register(): void;
    getConfigValue(key: string): any;
}
