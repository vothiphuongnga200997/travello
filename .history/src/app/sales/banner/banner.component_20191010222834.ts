import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
    images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

    constructor() {}

    ngOnInit() {}
}
