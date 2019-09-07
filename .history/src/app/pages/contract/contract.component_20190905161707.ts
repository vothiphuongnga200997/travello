import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    selectedCityIds: string[];
    users = [{ id: 'anjmao', name: 'Anjmao' }, { id: 'varnas', name: 'Tadeus Varnas' }];
    constructor() {}

    ngOnInit() {}
    addCustomUser = term => ({ id: term, name: term });
}
