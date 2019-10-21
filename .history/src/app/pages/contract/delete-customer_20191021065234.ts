import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../shared/services/contract.service';
@Component({
    selector: 'ngx-contract',
    styleUrls: ['./delete-customer.scss'],
    template: `
        <nb-card>
            <nb-card-header>
                {{ title }}
                <h6 class="close " aria-label="Close" (click)="dismiss()">
                    <span aria-hidden="true">&times;</span>
                </h6>
            </nb-card-header>
            <nb-card-body>
                <div>Do you want to delete id {{ this.id }}</div>
                <div class="footer">
                    <button class="float-right btn btn-info" (click)="delete()">OK</button>
                    <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteComponent implements OnInit {
    id: String;
    title: String;
    idTour: string;
    quantity: number;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {}
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        let i = await this.contractService.delete(this.id, this.idTour, this.quantity);
        if (i) {
            this.ref.close({
                pennant: true,
            });
        }
    }
}
@Component({
    selector: 'ngx-contract',
    styleUrls: ['./delete-customer.scss'],
    template: `
        <nb-card>
            <nb-card-header>
                {{ title }}
                <h6 class="close " aria-label="Close" (click)="dismiss()">
                    <span aria-hidden="true">&times;</span>
                </h6>
            </nb-card-header>
            <nb-card-body>
                <div>Do you want to delete id</div>
                <div class="footer">
                    <button class="float-right btn btn-info">OK</button>
                    <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteTicketComponent implements OnInit {
    title: string;
    idUser: string;
    idTour: string;
    name: string;
    phone: any;
    createAt: any;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {}
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    // async delete() {
    //     let i = await this.contractService.delete(this.id, this.idTour, this.quantity);
    //     if (i) {
    //         this.ref.close({
    //             pennant: true,
    //         });
    //     }
    // }
}
