import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
@Component({
    selector: 'ngx-contract',
    styleUrls: ['./add-customer/add-customer.component.scss'],
    template: `
        <nb-card>
            <nb-card-header>
                {{ title }}
                <button type="button" class="close " aria-label="Close" (click)="dismiss()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </nb-card-header>
            <nb-card-body>
                <div>sffdsfdsf</div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteComponent implements OnInit {
    title: String;
    constructor(protected ref: NbDialogRef<DeleteComponent>) {}
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
}
