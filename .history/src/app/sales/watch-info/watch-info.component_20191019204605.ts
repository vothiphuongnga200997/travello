import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit {
    constructor(private contractService: ContractService) {}
    ngOnInit() {}
    async click() {
        let i = await this.contractService.sendMail();
        console.log(i);
    }
}
