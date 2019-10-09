import { Component } from '@angular/core';
@Component({
    selector: 'ngx-pages',
    styleUrls: ['pages.component.scss'],
    templateUrl: './pages.component.html',
})
export class PagesComponent {
    public code: string = ``;
    public currentWorkFlow: any = {};

    constructor() {}
}
