import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { TourService } from '../../../shared/services/tour.service';
import { from } from 'rxjs';
@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    loading: boolean;
    event: any;
    listGuide: Array<any>;
    listLocation: Array<any>;
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    constructor(private tourService: TourService) {
        this.getGuide();
    }

    ngOnInit() {
        console.log(this.event);
    }

    async getGuide() {
        let result = await this.tourService.getGuide(this.event);
        console.log(result);
    }
    async getLocation() {
        let result = await this.tourService.getLocation(this.listLocation);
        console.log(result);
    }
}
