import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs';

@Component({
    selector: 'ngx-result-tour',
    templateUrl: './result-tour.component.html',
    styleUrls: ['./result-tour.component.scss'],
})
export class ResultTourComponent implements OnInit, OnDestroy {
    private dataSearchFromHomeComponet: any;

    private subscribeGetSearchParams: any;
    constructor(private router: Router, private activeRoute: ActivatedRoute) {}

    ngOnInit() {
        this.subscribeGetSearchParams = this.activeRoute.queryParams.subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.dataSearchFromHomeComponet = params;
            console.log('dataSearchFromHomeComponet ResultTourComponent', this.dataSearchFromHomeComponet);
        });
    }

    ngOnDestroy(): void {
        this.subscribeGetSearchParams.unsubscribe();
    }
}
