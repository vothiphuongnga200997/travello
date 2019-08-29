import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    protected searchStr: string;
    protected captain: string;
    protected selectedColor: string;
    protected dataService: CompleterData;
    listLocations: Array<any> = [];

    protected searchData = [
        { color: 'red', value: '#f00' },
        { color: 'green', value: '#0f0' },
        { color: 'blue', value: '#00f' },
        { color: 'cyan', value: '#0ff' },
        { color: 'magenta', value: '#f0f' },
        { color: 'yellow', value: '#ff0' },
        { color: 'black', value: '#000' },
        { color: 'flipkart', value: 'flipkart-coupons' },
    ];

    title: string;
    stateForm: FormGroup;

    showDropDown = false;

    constructor(private completerService: CompleterService, private router: Router) {
        this.dataService = completerService.local(this.searchData, 'color', 'color');
    }
    protected onSelected(item: CompleterItem) {
        this.selectedColor = item ? item.title : '';
        this.listLocations.push({
            location: this.selectedColor,
        });
        console.log(this.listLocations);
    }
    ngOnInit() {}
}
