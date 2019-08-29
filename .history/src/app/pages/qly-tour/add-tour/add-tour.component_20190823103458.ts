import { CompleterService, CompleterData } from 'ng2-completer';
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    title: string;

    constructor() {}
    ngOnInit() {}
}
