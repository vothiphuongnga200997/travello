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
        // this.deleteArray = this.event.[numberContract].tourist.slice();
        // this.deleteArray.splice(numberTourist, 1);
        // console.log(this.deleteArray);
        // this.dialogService
        //     .open(DeleteTicketComponent, {
        //         context: {
        //             title: 'Delete',
        //             info: info,
        //             startDay: startDay,
        //             array: this.deleteArray,
        //             idContract: idContract,
        //             idTour: idTour,
        //             quantity: quantity,
        //         },
        //     })
        //     .onClose.subscribe(async data => {
        //         if (data) {
        //             if (data.pennant) {
        //                 await this.getContract();
        //                 this.toastrService.success(`Delete Success`, 'Delete success');
        //             } else {
        //                 await this.getContract();
        //                 this.toastrService.error(`Delete Error`);
        //             }
        //         }
        //     });
    }
}
