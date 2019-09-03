import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';

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
    registerForm: FormGroup;

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

    constructor(
        private completerService: CompleterService,
        private router: Router,
        protected ref: NbDialogRef<AddTourComponent>,
        private formBuilder: FormBuilder,
    ) {
        this.dataService = completerService.local(this.searchData, 'color', 'color');
    }
    protected onSelected(item: CompleterItem) {
        this.selectedColor = item ? item.title : '';
        if (this.selectedColor !== '') {
            this.listLocations.push({
                location: this.selectedColor,
            });
        }

        // console.log(this.listLocations);
    }
    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            nameTour: ['', Validators.required],
            duration: ['', Validators.required],
            hotel: ['', Validators.required],
            guide: ['', Validators.required],
            childrenPrices: ['', Validators.required],
            adultPrices: ['', Validators.required],
            note: ['', Validators.required],
            startDaye: ['', Validators.required],
            endDate: ['', Validators.required],
            quantity: ['', Validators.required],
        });
    }
    dismiss() {
        this.ref.close();
    }
    destroy(location) {
        console.log(location);
        this.listLocations.splice(location, 1);
    }
}
