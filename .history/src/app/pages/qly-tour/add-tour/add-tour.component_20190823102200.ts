import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';
@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    protected searchStr: string;
    protected captain: string;
    protected dataService: CompleterData;
    title: string;
    @ViewChild('notification') el: ElementRef;
    parentClass: any;
    protected captains = [
        'James T. Kirk',
        'Benjamin Sisko',
        'Jean-Luc Picard',
        'Spock',
        'Jonathan Archer',
        'Hikaru Sulu',
        'Christopher Pike',
        'Rachel Garrett',
    ];
    constructor() {}

    ngOnInit() {}
    listDD = [];
}
