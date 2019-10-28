import { Component, OnInit } from '@angular/core';
import { DeleteTicketComponent } from '../delete-customer';
import { NbDialogService } from '@nebular/theme';

@Component({
    selector: 'ngx-info-tourist',
    templateUrl: './info-tourist.component.html',
    styleUrls: ['./info-tourist.component.scss'],
})
export class InfoTouristComponent implements OnInit {
    event: any;
    constructor(private dialogService: NbDialogService) {}

    ngOnInit() {}

    deleteArray: Array<any>;
    deleteTicket(event, numberTourist) {
        console.log(event);
        this.deleteArray = event.tourist[numberTourist].slice();
        this.deleteArray.splice(numberTourist, 1);
        console.log(this.deleteArray);
        this.dialogService
            .open(DeleteTicketComponent, {
                context: {
                    title: 'Delete',
                    info: event.tourist[numberTourist],
                    startDay: event.startDay,
                    array: this.deleteArray,
                    idContract: event.id,
                    idTour: event.idTour,
                    quantity: event.tourQuantity,
                },
            })
            .onClose.subscribe(async data => {
                // if (data) {
                //     if (data.pennant) {
                //         await this.getContract();
                //         this.toastrService.success(`Delete Success`, 'Delete success');
                //     } else {
                //         await this.getContract();
                //         this.toastrService.error(`Delete Error`);
                //     }
                // }
            });
    }
}
