import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export declare class ContractComponent implements OnInit {
    protected service: NbAuthService;
    protected options: {};
    protected cd: ChangeDetectorRef;
    protected router: Router;
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
    constructor(service: NbAuthService, options: {}, cd: ChangeDetectorRef, router: Router);
    ngOnInit();
    register(): void;
    getConfigValue(key: string): any;
}
