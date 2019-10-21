import { Component, OnInit } from '@angular/core';
import { WatchInfoService } from '../../shared/services/watch-info-service';

@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit {
    pending: Array<any>;
    end: Array<any>;
    constructor(private watchInfoService: WatchInfoService) {}
    ngOnInit() {}

    async getContract() {
        this.pending = [];
        this.end = [];
        let today = new Date();
        let result = await this.watchInfoService.getContrat('70vrTOFUHt');
        for (let i of result) {
            if (i.attributes.objTour.attributes.startDay < today) {
                this.pending.push({});
            }
        }
        console.log(result);
    }
}
