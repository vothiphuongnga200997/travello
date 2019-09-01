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

    ngOnInit(): void {
        this.heroForm = new FormGroup({
            name: new FormControl(this.hero.name, [Validators.required, Validators.minLength(4)]),
            alterEgo: new FormControl(this.hero.alterEgo),
            power: new FormControl(this.hero.power, Validators.required),
        });
    }
    get name() {
        return this.heroForm.get('name');
    }
    get power() {
        return this.heroForm.get('power');
    }
}
