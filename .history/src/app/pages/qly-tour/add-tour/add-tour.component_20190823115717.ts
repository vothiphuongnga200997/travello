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
    protected searchData = [
        { color: 'red' },
        { color: 'green' },
        { color: 'blue' },
        { color: 'cyan' },
        { color: 'magenta' },
        { color: 'yellow' },
        { color: 'black' },
        { color: 'flipkart' },
    ];

    title: string;
    stateForm: FormGroup;

    showDropDown = false;

    constructor(private completerService: CompleterService, private router: Router) {
        this.dataService = completerService.local(this.searchData, 'color', 'color');
    }
    protected onSelected(item: CompleterItem) {
        this.selectedColor = item ? item.title : '';
        this.router.navigate(['/store/' + this.selectedColor]);
    }
    ngOnInit() {}
}
