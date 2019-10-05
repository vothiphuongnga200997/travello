import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
@Component({
    selector: 'ngx-contract',
    styleUrls: ['./delete-customer.scss'],
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
                <div class="footer">
                    <button class="float-right " nbButton medium status="default" (click)="dismiss()">Cancel</button>
                    <button class="float-right mr-2 ml-0" nbButton hero medium status="primary">Delete</button>
                </div>
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
