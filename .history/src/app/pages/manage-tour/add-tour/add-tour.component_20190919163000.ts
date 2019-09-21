import { NgModule, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { GuideService } from '../../../shared/services/guide.service';
import { LocationService } from '../../../shared/services/location.service';

@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    protected captain: string;
    protected selectedLocaion: string;
    protected dataService: CompleterData;
    @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
    listLocations: Array<any> = [];
    getLocations: Array<any> = [];
    getGuides: Array<any> = [];
    registerForm: FormGroup;
    title: string;
    stateForm: FormGroup;
    idTour: string;
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
    context: string;
    guide: any;
    fileName: string;
    public imagePath;
    images: Array<any> = [];
    public message: string;
    constructor(
        private completerService: CompleterService,
        private router: Router,
        protected ref: NbDialogRef<AddTourComponent>,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private guideService: GuideService,
    ) {
        this.getLocation();
        this.getGuide();
        this.dataService = completerService.local(this.getLocations, 'location', 'location');
    }
    protected onSelected(item: CompleterItem) {
        if (item) {
            this.listLocations.push({
                id: item.originalObject.id,
                location: item.originalObject.location,
            });
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            idTour: ['', Validators.required],
            nameTour: ['', Validators.required],
            duration: ['', Validators.required],
            hotel: ['', Validators.required],
            guide: ['', Validators.required],
            childrenPrice: ['', Validators.required],
            adultPrice: ['', Validators.required],
            startDay: ['', Validators.required],
            endDay: ['', Validators.required],
            quantity: ['', Validators.required],
            departure: ['', Validators.required],
            location: ['', Validators.required],
            note: ['', Validators.required],
        });
    }
    dismiss() {
        this.ref.close();
    }
    destroy(location) {
        this.listLocations.splice(location, 1);
    }
    get f() {
        return this.registerForm.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        this.ref.close({
            idTour: this.idTour,
            nameTour: this.nameTour,
            duration: this.duration,
            departure: this.departure,
            location: this.listLocations,
            guide: this.guide,
            startDay: new Date(this.startDay),
            endDay: new Date(this.endDay),
            quantity: this.quantity,
            hotel: this.hotel,
            childrenPrice: this.childrenPrice,
            adultPrice: this.adultPrice,
            image: this.images,
            note: this.note,
        });
    }

    async getGuide() {
        let results = await this.guideService.getListGuides();
        for (let i = 0; i < results.length; i++) {
            const obj = results[i];
            this.getGuides.push({
                id: obj.id,
                fullName: obj.get('fullName'),
            });
        }
    }
    async getLocation() {
        let results = await this.locationService.getListLocations();
        for (let i = 0; i < results.length; i++) {
            const obj = results[i];
            this.getLocations.push({
                id: obj.id,
                location: obj.get('location'),
            });
        }
    }
    preview(files) {
        this.fileName = files.length + 'files';
        if (files.length === 0) return;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let mimeType = files[i].type;
                if (mimeType.match(/image\/*/) == null) {
                    this.message = 'Only images are supported.';
                    return;
                }

                let reader = new FileReader();
                this.imagePath = files;
                reader.readAsDataURL(files[i]);
                reader.onload = _event => {
                    this.images.unshift({
                        imgURL: reader.result,
                        file: files[i],
                    });
                };
            }
        }
    }
    remove(i) {
        this.images.splice(i, 1);
    }
    openInputFile() {
        this.inputFile.nativeElement.click();
    }
}
