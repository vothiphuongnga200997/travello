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
}
