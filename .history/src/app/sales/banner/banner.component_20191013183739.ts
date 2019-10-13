import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from 'parse';
@Component({
    selector: 'ngx-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
    pauseOnHover = false;
    public href: string = '';

    constructor(private router: Router) {}

    ngOnInit() {}
}
