import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-info-tourist',
    templateUrl: './info-tourist.component.html',
    styleUrls: ['./info-tourist.component.scss'],
})
export class InfoTouristComponent implements OnInit {
    event: any;
    constructor() {}

    ngOnInit() {
        console.log(this.event);
    }
}
