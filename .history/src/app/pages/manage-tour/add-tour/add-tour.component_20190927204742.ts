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
    requiredGuide = '';
    requiredImage = '';
    objId = '';
    queryGuide: any;
    queryLocaton: any;
    commonSelectedItem: Array<any> = [];
    downloadMenu = [
        { title: 'Python', value: 'python' },
        { title: 'Javascript', value: 'javascript' },
        { title: 'Typescript', value: 'typescript' },
    ];
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
            note: [''],
        });
        if (this.obj) {
            this.commonSelectedItem[0] = 'python';
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
                    fillName: this.queryGuide[i].get('fullName'),
                });
                // this.tourService.deleteGuide(this.obj.res.id, g[0]);
            }
            let l = await this.tourService.getLocation(this.obj.res);
            for (let i = 0; i < l.length; i++) {
                this.listLocations.push({
                    id: l[i].id,
                    location: l[i].get('location'),
                });
                // this.tourService.deleteLocation(this.obj.res.id, l[i]);
            }
            let images = await this.tourService.getImage(this.obj.res);
            for (let i = 0; i < images.length; i++) {
                this.images.push({
                    imgURL: images[i].get('image').url(),
                    name: images[i].get('nameFile'),
                    file: images[i].get('image'),
                });
            }
            console.log(images);
        }
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
        for (let g of this.queryGuide) this.tourService.deleteGuide(this.obj.res.id, g);
        for (let l of this.queryLocaton) this.tourService.deleteGuide(this.obj.res.id, l[i]);
        this.submitted = true;
        console.log(this.images);
        if (this.registerForm.invalid) {
            if (this.listLocations.length === 0) this.requiredLocation = 'Location is required';
            else {
                this.requiredLocation = '';
            }
            if (this.guide.length === 0) this.requiredGuide = 'Guide is required';
            else {
                this.requiredGuide = '';
            }
            if (this.images.length === 0) this.requiredImage = 'Image is required';
            else this.requiredImage = '';
            return;
        }
        if (this.listLocations.length > 0 && this.guide.length > 0 && this.images.length > 0) {
            if (this.obj) this.objId = this.obj.res.id;
            this.ref.close({
                id: this.objId,
                code: this.code,
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
                itinerary: this.mycontent,
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
