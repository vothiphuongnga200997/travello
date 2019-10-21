import { Component, OnInit } from '@angular/core';
import { WatchInfoService } from '../../shared/services/watch-info-service';

@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit {
    constructor(private watchInfoService: WatchInfoService) {}
    ngOnInit() {}

    async getContract() {
        let result = await this.watchInfoService.getContrat();
    }
}
