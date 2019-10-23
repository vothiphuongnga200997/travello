import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ContractService } from '../../shared/services/contract.service';
import * as moment from 'moment';
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
    tourist: any;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {}
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        console.log(this.id, this.idTour, this.quantity, this.tourist);
        // let i = await this.contractService.deleteContract(this.id, this.idTour, this.quantity, this.tourist);
        // if (i) {
        //     this.ref.close({
        //         pennant: true,
        //     });
        // }
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
                    <button class="float-right btn btn-info" (click)="delete()">OK</button>
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
    startDay: any;
    array: Array<any>;
    constructor(protected ref: NbDialogRef<DeleteComponent>, private contractService: ContractService) {
        console.log('dele');
    }
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        let currentDay = moment(Date()).format('YYYY/MM/DD');
        let startDay = moment(this.startDay).format('YYYY/MM/DD');
        let firstDate = moment(startDay);
        let diffInDays = Math.abs(firstDate.diff(currentDay, 'day'));
        if (diffInDays < 7) {
            console.log(diffInDays);
        }
    }
}
