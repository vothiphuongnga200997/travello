import { ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { GuideService } from '../../../shared/services/guide.service';
import { LocationService } from '../../../shared/services/location.service';
import * as moment from 'moment';
import { TourService } from '../../../shared/services/tour.service';
@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    protected captain: string;
    protected selectedLocaion: string;
    protected dataService: CompleterData;
    protected dataGuide: CompleterData;
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
    fileName: string;
    public imagePath;
    images: Array<any> = [];
    public message: string;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    obj: any;
    guide: Array<any> = [];
    requiredLocation = '';
    requiredImage = '';
    objId = '';
    queryGuide: any;
    queryLocation: any;
    provisional: any;
    checkDay: Array<any> = [];

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
        this.registerForm = this.formBuilder.group({
            code: ['', Validators.required],
            nameTour: ['', Validators.required],
            duration: ['', Validators.required],
            hotel: ['', Validators.required],
            childrenPrice: ['', Validators.required],
            adultPrice: ['', Validators.required],
            startDay: ['', Validators.required],
            endDay: ['', Validators.required],
            quantity: ['', Validators.required],
            departure: ['', Validators.required],
            itinerary: ['', Validators.required],
            guide: ['', Validators.required],
            note: [''],
        });
        if (this.obj) {
            (this.nameTour = this.obj.res.get('nameTour')), (this.code = this.obj.res.get('code'));
            (this.duration = this.obj.res.get('duration')),
                (this.hotel = this.obj.res.get('hotel')),
                (this.childrenPrice = this.obj.res.get('childrenPrice')),
                (this.adultPrice = this.obj.res.get('adultPrice')),
                (this.departure = this.obj.res.get('departure')),
                (this.quantity = this.obj.res.get('quantity')),
                (this.startDay = this.formatDate(this.obj.res.get('startDay'))),
                (this.endDay = this.formatDate(this.obj.res.get('endDay'))),
                (this.mycontent = this.obj.res.get('itinerary'));
            this.queryGuide = await this.tourService.getGuide(this.obj.res);
            for (let i = 0; i < this.queryGuide.length; i++) {
                this.guide.push({
                    id: this.queryGuide[i].id,
                    fullName: this.queryGuide[i].get('fullName'),
                });
            }
            this.queryLocation = await this.tourService.getLocation(this.obj.res);
            for (let i = 0; i < this.queryLocation.length; i++) {
                this.listLocations.push({
                    id: this.queryLocation[i].id,
                    location: this.queryLocation[i].get('location'),
                });
            }
            let images = await this.tourService.getImage(this.obj.res);
            for (let i = 0; i < images.length; i++) {
                this.images.push({
                    imgURL: images[i].get('image').url(),
                    name: images[i].get('nameFile'),
                    file: images[i].get('image'),
                });
            }
        }
    }

    get f() {
        return this.registerForm.controls;
    }

    async onSubmit() {
        this.submitted = true;
        console.log(this.guide);
        // if (this.registerForm.invalid) {
        //     if (this.listLocations.length === 0) this.requiredLocation = 'Location is required';
        //     else {
        //         this.requiredLocation = '';
        //     }
        //     if (this.images.length === 0) this.requiredImage = 'Image is required';
        //     else this.requiredImage = '';
        //     return;
        // } else {
        //     if (this.listLocations.length === 0) this.requiredLocation = 'Location is required';
        //     else {
        //         this.requiredLocation = '';
        //     }

        //     if (this.images.length === 0) this.requiredImage = 'Image is required';
        //     else this.requiredImage = '';
        // }
        // if (this.obj) {
        //     await this.tourService.deleteImg(this.obj.res);
        //     for (let g of this.queryGuide) await this.tourService.deleteGuide(this.obj.res.id, g);
        //     for (let l of this.queryLocation) await this.tourService.deleteLocation(this.obj.res.id, l);
        // }

        // if (this.listLocations.length > 0 && this.guide.length > 0 && this.images.length > 0) {
        //     if (this.obj) this.objId = this.obj.res.id;
        //     this.ref.close({
        //         id: this.objId,
        //         code: this.code,
        //         nameTour: this.nameTour,
        //         duration: this.duration,
        //         departure: this.departure,
        //         location: this.listLocations,
        //         guide: this.guide,
        //         startDay: new Date(this.startDay),
        //         endDay: new Date(this.endDay),
        //         quantity: this.quantity,
        //         hotel: this.hotel,
        //         childrenPrice: this.childrenPrice,
        //         adultPrice: this.adultPrice,
        //         image: this.images,
        //         note: this.note,
        //         itinerary: this.mycontent,
        //     });
        // }
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
    async getGuide(idGuide?) {}

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
    async checkDate() {
        if (this.startDay && this.endDay) {
            this.checkDay.push({
                start: this.startDay,
                endDay: this.endDay,
            });
            let result = await this.guideService.findTour(this.startDay, this.endDay);
            this.provisional = result;
            console.log(this.provisional);
            for (let n of result) {
                this.getGuides.push({
                    id: n.id,
                    fullName: n.get('fullName'),
                });
            }
        }
    }
}
