import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    loading: boolean;
    event: any;
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    constructor() {}

    ngOnInit() {
        console.log(this.event);
    }
}