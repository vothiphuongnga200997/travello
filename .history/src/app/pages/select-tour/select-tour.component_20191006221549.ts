import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ngx-select-tour',
    templateUrl: './select-tour.component.html',
    styleUrls: ['./select-tour.component.scss'],
})
export class SelectTourComponent implements OnInit {
    constructor(private router: ActivatedRoute) {}
    id: any;
    ngOnInit() {
        this.id = this.router.snapshot.paramMap.get('id');
    }
}
