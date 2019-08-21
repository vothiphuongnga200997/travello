import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
    moduleId: module.id,
    selector: 'report-cmp',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
})
export class ReportWorkFlowComponent implements OnInit {
    generalSource: SafeResourceUrl;

    robotSource: SafeResourceUrl;
    metricSource: SafeResourceUrl;
    statisticsSource: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {}

    onSelectedTime(event) {}
}
