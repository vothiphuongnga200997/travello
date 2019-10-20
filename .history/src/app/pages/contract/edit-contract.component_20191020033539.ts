import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'edit-contract',
    templateUrl: './edit.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class EditContractComponent implements OnInit {
    title: string;
    idEdit: string;
    constructor() {}

    ngOnInit() {}
}
