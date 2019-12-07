import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-find',
    templateUrl: './find.component.html',
    styleUrls: ['./home.component.scss'],
})
export class FindComponent implements OnInit {
    location: any = '';
    startDay: any;
    endDay: any;
    money: any = '';
    constructor(private router: Router) {}
    ngOnInit() {}
    findTour() {
        let dataWillSendResultTour = { startDay: this.startDay, endDay: this.endDay, money: this.money, location: this.location };
        console.log('dataWillSendResultTour ', dataWillSendResultTour);
        this.router.navigate(['/resultTour/'], {
            queryParams: dataWillSendResultTour,
        });
    }
}
