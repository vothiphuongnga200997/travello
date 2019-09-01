import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    heroForm: FormGroup;
    hero: any;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {}
}
