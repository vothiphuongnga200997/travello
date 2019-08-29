import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    title: string;
    @ViewChild('notification') el: ElementRef;
    parentClass: any;
    constructor() {}

    ngOnInit() {}
    listDD = [];
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.parentClass = document.getElementsByClassName('single-pane')[0];
        this.parentClass.insertAdjacentHTML('afterbegin', this.notificationsElements.nativeElement.innerHTML);
    }
}
