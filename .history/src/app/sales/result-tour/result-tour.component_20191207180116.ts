import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ngx-result-tour',
    templateUrl: './result-tour.component.html',
    styleUrls: ['./result-tour.component.scss'],
})
export class ResultTourComponent implements OnInit {
    private dataSearchFromHomeComponet: any;
    constructor(private router: Router, private activeRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activeRoute.queryParams.subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.dataSearchFromHomeComponet = params;
            console.log('dataSearchFromHomeComponet ResultTourComponent', this.dataSearchFromHomeComponet);
        });
    }
}
