import { NgModule, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { GuideService } from '../../../shared/services/guide.service';
import { LocationService } from '../../../shared/services/location.service';
import * as moment from 'moment';
import { TourService } from '../../../shared/services/tour.service';
import { async } from '@angular/core/testing';

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
    code: string;
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
    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    obj: any;
    @ViewChild('myckeditor', { static: true }) ckeditor: any;
    constructor(
        private completerService: CompleterService,
        private router: Router,
        protected ref: NbDialogRef<AddTourComponent>,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private guideService: GuideService,
        private tourService: TourService,
    ) {
        this.getLocation();
        this.getGuide();
        this.dataService = completerService.local(this.getLocations, 'location', 'location');
        this.ckeConfig = {
            allowedContent: false,
            extraPlugins: 'divarea',
            forcePasteAsPlainText: true,
        };
    }
    protected onSelected(item: CompleterItem) {
        if (item) {
            this.listLocations.push({
                id: item.originalObject.id,
                location: item.originalObject.location,
            });
        }
    }

    async ngOnInit() {
        if (this.obj) {
            console.log(this.obj);
            (this.nameTour = this.obj.res.get('nameTour')),
                (this.duration = this.obj.res.get('duration')),
                (this.hotel = this.obj.res.get('hotel')),
                (this.childrenPrice = this.obj.res.get('childrenPrice')),
                (this.adultPrice = this.obj.res.get('adultPrice')),
                (this.departure = this.obj.res.get('departure')),
                (this.quantity = this.obj.res.get('quantity')),
                (this.startDay = this.formatDate(this.obj.res.get('startDay'))),
                (this.endDay = this.formatDate(this.obj.res.get('endDay'))),
                (this.mycontent = this.obj.res.get('itinerary'));
            let i = this.tourService.getGuide(this.obj.res);
            console.log(i);
        }
        this.registerForm = this.formBuilder.group({
            code: ['', Validators.required],
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
            itinerary: ['', Validators.required],
            image: ['', Validators.required],
            note: [''],
        });
    }
    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('YYYY-MM-DDTkk:mm');
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
        console.log(this.images);
        console.log(this.guide);
        console.log(this.listLocations);
        // this.submitted = true;
        // if (this.registerForm.invalid) {
        //     return;
        // }
        // this.ref.close({
        //     code: this.code,
        //     nameTour: this.nameTour,
        //     duration: this.duration,
        //     departure: this.departure,
        //     location: this.listLocations,
        //     guide: this.guide,
        //     startDay: new Date(this.startDay),
        //     endDay: new Date(this.endDay),
        //     quantity: this.quantity,
        //     hotel: this.hotel,
        //     childrenPrice: this.childrenPrice,
        //     adultPrice: this.adultPrice,
        //     image: this.images,
        //     note: this.note,
        //     itinerary: this.mycontent,
        // });
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
                        name: files[i].name,
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
