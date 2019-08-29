import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';
import { NgModule } from '@angular/core';

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
    protected searchData = [
        { color: 'red', value: '#f00' },
        { color: 'green', value: '#0f0' },
        { color: 'blue', value: '#00f' },
        { color: 'cyan', value: '#0ff' },
        { color: 'magenta', value: '#f0f' },
        { color: 'yellow', value: '#ff0' },
        { color: 'black', value: '#000' },
    ];
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
    constructor(private completerService: CompleterService) {
        this.dataService = completerService.local(this.searchData, 'color', 'color');
    }
    ngOnInit() {}
    listDD = [];
}
