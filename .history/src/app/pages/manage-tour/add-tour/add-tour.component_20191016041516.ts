import { ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
    dataService1: any;

    @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
    listLocations: Array<any> = [];
    getLocations: Array<any> = [];
    getGuides: Array<any> = [];
    public registerForm: FormGroup;
    public contactList: FormArray;
    listGuide: Array<any> = [];
    title: string;
    code: string; // ma check ma tour
    submitted = false;
    fileName: string;
    public imagePath;
    images: Array<any> = [];
    public message: string;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    obj: any;
    requiredLocation = '';
    requiredGuide = '';
    requiredImage = '';
    objId = ''; // id tour edit
    queryGuide: any;
    queryLocation: any;
    checkCode: string = '';
    @ViewChild('myckeditor', { static: true }) ckeditor: any;
    numberRun: number; // kiem tra so lan run ham Date
    provisional: any; // bien tam ham checkDate
    sale: boolean = false;
    guideFirst: Array<any> = []; // mang huong dan vien ban dau
    locationFirst: Array<any> = []; // mang dia diem ban dau
    get contactFormGroup() {
        return this.registerForm.get('contacts') as FormArray;
    }
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
        (this.dataGuide = completerService.local(this.getGuides, 'fullName', 'fullName')),
            (this.ckeConfig = {
                allowedContent: false,
                extraPlugins: 'divarea',
                forcePasteAsPlainText: true,
            });
    }

    protected onSelected(item: CompleterItem) {
        if (item) {
            this.listLocations.push({
                id: item.originalObject.id,
                location: item.originalObject.location,
            });
        }
        this.requiredLocation = '';
    }
    protected onSelectedGuide(item: CompleterItem) {
        if (item) {
            this.listGuide.push({
                id: item.originalObject.id,
                fullname: item.originalObject.fullname,
            });
        }
        this.requiredGuide = '';
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
            vehicle: ['', Validators.required],
            note: [''],
            contacts: this.formBuilder.array([]),
            specical: [null],
            saleoff: [null],
        });
        this.contactList = this.registerForm.get('contacts') as FormArray;

        // Phần edit/////

        if (this.obj) {
            if (this.obj.res.get('saleoff')) {
                this.sale = true;
            }
            this.registerForm = this.formBuilder.group({
                code: [this.obj.res.get('code'), Validators.required],
                nameTour: [this.obj.res.get('nameTour'), Validators.required],
                duration: [this.obj.res.get('duration'), Validators.required],
                hotel: [this.obj.res.get('hotel'), Validators.required],
                childrenPrice: [this.obj.res.get('childrenPrice'), Validators.required],
                adultPrice: [this.obj.res.get('adultPrice'), Validators.required],
                startDay: [this.formatDate(this.obj.res.get('startDay')), Validators.required],
                endDay: [this.formatDate(this.obj.res.get('endDay')), Validators.required],
                quantity: [this.obj.res.get('quantity'), Validators.required],
                departure: [this.obj.res.get('departure'), Validators.required],
                itinerary: [this.obj.res.get('itinerary'), Validators.required],
                vehicle: [this.obj.res.get('vehicle'), Validators.required],
                note: [this.obj.res.get('note')],
                specical: [this.obj.res.get('specical')],
                saleoff: [this.obj.res.get('saleoff')],
                contacts: this.formBuilder.array([]),
            });
            this.contactList = this.registerForm.get('contacts') as FormArray;

            this.queryGuide = await this.tourService.getGuide(this.obj.res);
            for (let i = 0; i < this.queryGuide.length; i++) {
                this.listGuide.push({
                    id: this.queryGuide[i].id,
                    fullname: this.queryGuide[i].get('fullname'),
                });
            }
            this.guideFirst = this.queryGuide;
            this.queryLocation = await this.tourService.getLocation(this.obj.res);
            for (let i = 0; i < this.queryLocation.length; i++) {
                this.listLocations.push({
                    id: this.queryLocation[i].id,
                    location: this.queryLocation[i].get('location'),
                });
            }
            this.locationFirst = this.queryLocation;
            let images = await this.tourService.getImage(this.obj.res);
            for (let i = 0; i < images.length; i++) {
                this.images.push({
                    imgURL: images[i].get('image').url(),
                    name: images[i].get('nameFile'),
                    file: images[i].get('image'),
                });
            }
            for (let i of this.obj.res.get('surcharge')) {
                try {
                    this.contactList.push(
                        this.formBuilder.group({
                            type: [i.type],
                            price: [i.price],
                        }),
                    );
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
    }
    createContact(): FormGroup {
        try {
            return this.formBuilder.group({
                type: [null, Validators.compose([Validators.required])],
                price: [null, Validators.compose([Validators.required])],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContact() {
        this.contactList.push(this.createContact());
    }
    async removeContact(index) {
        this.contactList.removeAt(index);
    }
    getContactsFormGroup(index): FormGroup {
        const formBuilder = this.contactList.controls[index] as FormGroup;
        return formBuilder;
    }
    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('YYYY-MM-DDTkk:mm');
    }
    dismiss() {
        this.ref.close();
    }

    get f() {
        return this.registerForm.controls;
    }
    error: any = { isError: false, errorMessage: '' };
    compareTwoDates() {
        this.error = { isError: false, errorMessage: '' };

        if (new Date(this.registerForm.controls['endDay'].value) < new Date(this.registerForm.controls['startDay'].value)) {
            this.error = { isError: true, errorMessage: 'End Date cant before start date' };
            console.log(this.error);
        }
    }
    async onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            if (this.listLocations.length === 0) this.requiredLocation = 'Location is required';
            else {
                this.requiredLocation = '';
            }
            if (this.listGuide.length === 0) this.requiredGuide = 'Guide is required';
            else {
                this.requiredGuide = '';
            }
            if (this.images.length === 0) this.requiredImage = 'Image is required';
            else this.requiredImage = '';
            return;
        } else {
            if (this.listLocations.length === 0) this.requiredLocation = 'Location is required';
            else {
                this.requiredLocation = '';
            }
            if (this.listGuide.length === 0) this.requiredGuide = 'Guide is required';
            else {
                this.requiredGuide = '';
            }
            if (this.images.length === 0) this.requiredImage = 'Image is required';
            else this.requiredImage = '';
        }
        if (this.obj) {
            await this.tourService.deleteImg(this.obj.res);
            for (let g of this.queryGuide) await this.tourService.deleteGuide(this.obj.res.id, g);
            for (let l of this.queryLocation) await this.tourService.deleteLocation(this.obj.res.id, l);
        }
        if (!this.sale) this.registerForm.value.saleoff = null;
        if (this.listLocations.length > 0 && this.listGuide.length > 0 && this.images.length > 0 && this.checkCode === '') {
            if (this.obj) this.objId = this.obj.res.id;
            this.ref.close({
                id: this.objId,
                guideFirst: this.guideFirst,
                locationFirst: this.locationFirst,
                value: this.registerForm.value,
                location: this.listLocations,
                guide: this.listGuide,
                image: this.images,
            });
        }
    }
    destroy(location) {
        this.listLocations.splice(location, 1);
    }
    destroyGuide(guide) {
        this.listGuide.splice(guide, 1);
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
            this.requiredImage = '';
        }
    }
    remove(i) {
        this.images.splice(i, 1);
    }
    openInputFile() {
        this.inputFile.nativeElement.click();
    }

    go: any;
    end: any;
    async checkDate() {
        if (this.numberRun === 0 && this.registerForm.value.startDay && this.registerForm.value.endDay) {
            let result = await this.guideService.findTour(this.registerForm.value.startDay, this.registerForm.value.endDay);
            for (let n of result) {
                this.getGuides.push({
                    id: n.id,
                    fullname: n.id + ': ' + n.get('fullname'),
                });
            }
            this.go = this.registerForm.value.startDay;
            this.end = this.registerForm.value.endDay;
            this.numberRun = 1;
        } else {
            if (this.registerForm.value.startDay && this.registerForm.value.endDay) {
                if (
                    Date.parse(this.end) !== Date.parse(this.registerForm.value.endDay) ||
                    Date.parse(this.go) !== Date.parse(this.registerForm.value.startDay)
                ) {
                    this.go = this.registerForm.value.startDay;
                    this.end = this.registerForm.value.endDay;
                    this.getGuides = [];
                    let result = await this.guideService.findTour(this.registerForm.value.startDay, this.registerForm.value.endDay);
                    this.provisional = result;
                    for (let n of result) {
                        this.getGuides.push({
                            id: n.id,
                            fullname: n.id + ': ' + n.get('fullname'),
                        });
                    }
                }
            }
        }
        this.dataService1 = this.completerService.local(this.getGuides, 'fullname', 'fullname');
    }
    async checkIdCode() {
        let i = await this.tourService.checkCode(this.registerForm.value.code.toUpperCase());
        if (i.length > 0) {
            this.checkCode = 'That code is already taken. Try another';
        } else {
            this.checkCode = '';
        }
    }
}
