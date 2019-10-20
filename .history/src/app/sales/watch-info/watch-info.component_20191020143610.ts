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
        let dataSendMail = {
            to: 'dyesebepn@gmail.com',
            content: 'This is test sendmail',
        };
        let i = await this.contractService.sendMail(dataSendMail);
        i.subscribe(async res => {
            // nhận data từ server ver62 cái id nó là res
            console.log('res', res);
        });
        console.log(i);
    }

    async getContract() {
        let i = await this.contractService.getUser();
        console.log(i);
    }
}
