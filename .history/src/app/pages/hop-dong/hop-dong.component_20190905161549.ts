import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'ngx-hop-dong',
    templateUrl: './hop-dong.component.html',
    styleUrls: ['./hop-dong.component.scss'],
})
export class HopDongComponent implements OnInit {
    selectedCityIds: string[];
    users = [{ id: 'anjmao', name: 'Anjmao' }, { id: 'varnas', name: 'Tadeus Varnas' }];
    constructor() {}

    ngOnInit() {}
    addCustomUser = term => ({ id: term, name: term });
}
