import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { LocationService } from '../../../shared/services/location.service';
import { GuideService } from '../../../shared/services/guide.service';

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
    listLocation: Array<any> = [];
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
    submitted = false;
    nameTour: string = '';

    duration: string = '';
    hotel: string = '';
    childrenPrice: number;
    adultPrice: number;
    note: string = '';
    startDay: any;
    endDay: any;
    quantity: number;
    departure: string = '';
    value: any;
    listGuide: Array<any> = [];
    listlocation: Array<any> = [];
    constructor(
        private completerService: CompleterService,
        private router: Router,
        protected ref: NbDialogRef<AddTourComponent>,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private guideService: GuideService,
    ) {
        console.log('add-tour');
        this.listGuides();
        this.dataService = completerService.local(this.listGuide, 'fullName', 'fullName');
    }
    protected onSelected(item: CompleterItem) {
        this.selectedColor = item ? item.title : '';
        if (this.selectedColor !== '') {
            this.listLocation.push({
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
            childrenPrice: ['', Validators.required],
            adultPrice: ['', Validators.required],
            note: ['', Validators.required],
            startDay: ['', Validators.required],
            endDay: ['', Validators.required],
            quantity: ['', Validators.required],
            departure: ['', Validators.required],
            location: ['', Validators.required],
            value: ['', Validators.required],
        });
    }

    dismiss() {
        this.ref.close();
    }
    destroy(location) {
        console.log(location);
        this.listLocation.splice(location, 1);
    }
    get f() {
        return this.registerForm.controls;
    }
    onSubmit() {
        console.log(this.childrenPrice);
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
    }
    async listLocations() {
        let results = await this.locationService.getListLocations();
        for (let i = 0; i < results.lenght; i++) {
            const obj = results[i];
            this.listLocations;
        }
    }
    async listGuides() {
        let results = await this.guideService.getListGuides();
        for (let i = 0; i < results.length; i++) {
            const obj = results[i];
            this.listGuide.push({
                id: obj.id,
                fullName: obj.get('fullName'),
            });
        }
    }
}
