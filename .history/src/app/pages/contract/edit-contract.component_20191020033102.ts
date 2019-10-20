import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'edit-contract',
    styleUrls: ['./delete-customer.scss'],
    template: `
        <nb-card>
            <nb-card-header>
                {{ title }}
                <h6 class="close " aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </h6>
            </nb-card-header>
            <nb-card-body>
                <div>Do you want to delete id </div>
                <div class="footer">
                    <button class="float-right btn btn-info" >OK</button>
                    <button class="float-right  btn btn-hint"Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class EditContractComponent implements OnInit {
    title: string;
    idEdit: string;
    constructor() {}

    ngOnInit() {}
}
