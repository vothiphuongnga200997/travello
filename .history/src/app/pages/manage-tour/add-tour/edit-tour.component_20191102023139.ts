import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { LocationService } from '../../../shared/services/location.service';
import { GuideService } from '../../../shared/services/guide.service';
import { TourService } from '../../../shared/services/tour.service';
import * as moment from 'moment';
import { FORMERR } from 'dns';

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './edit-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class EditTourComponent implements OnInit {
    title: string;
    obj: any;
    protected dataService: CompleterData;
    protected dataGuide: CompleterData;
    dataService1: any;

    @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
    listLocations: Array<any> = [];
    getLocations: Array<any> = [];
    getGuides: Array<any> = [];
    public registerForm: FormGroup;
    public contactList: FormArray;
    formPrivate: FormGroup;
    public contactList1: FormArray;
    get contactFormPrivate() {
        return this.formPrivate.get('listSchedule') as FormArray;
    }
    listGuide: Array<any> = [];

    arrayListGuide = new Array(); // mang luu guide theo thu tu thoi diem cap 2

    arrayListGuide1: Array<any> = []; // mang cap 1
    code: string; // ma check ma tour
    submitted = false;
    fileName: string;
    public imagePath;
    images: Array<any> = [];
    public message: string;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    requiredLocation = '';
    requiredImage = '';
    queryGuide: any;
    queryLocation: any;
    checkCode: string = '';
    @ViewChild('myckeditor', { static: true }) ckeditor: any;
    numberRun: number; // kiem tra so lan run ham Date
    provisional: any; // bien tam ham checkDate
    sale: boolean = false;
    locationFirst: Array<any> = []; // mang dia diem ban dau
    get contactFormGroup() {
        return this.registerForm.get('contacts') as FormArray;
    }
    constructor(
        protected ref: NbDialogRef<EditTourComponent>,
        private completerService: CompleterService,
        private router: Router,
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
    protected onSelectedGuide(item: CompleterItem, i) {
        if (item) {
            this.arrayListGuide[i].push({ id: item.originalObject.id, fullname: item.originalObject.fullname });
        }
    }

    async ngOnInit() {
        this.registerForm = this.formBuilder.group({
            code: [this.obj.info.get('code'), Validators.required],
            nameTour: [this.obj.info.get('nameTour'), Validators.required],
            duration: [this.obj.info.get('duration'), Validators.required],
            childrenPrice: [this.obj.info.get('childrenPrice'), Validators.required],
            adultPrice: [this.obj.info.get('adultPrice'), Validators.required],
            quantity: [this.obj.info.get('quantity'), Validators.required],
            departure: [this.obj.info.get('departure'), Validators.required],
            itinerary: [this.obj.info.get('itinerary'), Validators.required],
            policy: [this.obj.info.get('policy'), Validators.required],
            vehicle: [this.obj.info.get('vehicle'), Validators.required],
            note: [this.obj.info.get('note')],
            highlights: [this.obj.info.get('highlights'), Validators.required],
            contacts: this.formBuilder.array([]),
            specical: [this.obj.info.get('specical')],
            saleoff: [this.obj.info.get('saleoff')],
        });
        this.contactList = this.registerForm.get('contacts') as FormArray;
        this.formPrivate = this.formBuilder.group({
            listSchedule: this.formBuilder.array([this.createSchedule()]),
        });
        this.contactList1 = this.formPrivate.get('listSchedule') as FormArray;
        for (let i = 0; i < this.obj.schedule.length; i++) {
            this.arrayListGuide[i] = new Array();
            try {
                this.contactList1.push(
                    this.formBuilder.group({
                        startDay: [this.formatDate(this.obj.schedule[i].get('startDay')), Validators.required],
                        endDay: [this.formatDate(this.obj.schedule[i].get('endDay')), Validators.required],
                        hotel: [this.obj.schedule[i].get('hotel'), Validators.required],
                    }),
                );
                this.queryGuide = await this.tourService.getGuide(this.obj.schedule[i]);

                for (let guide of this.queryGuide) {
                    this.arrayListGuide[i].push({
                        id: guide.id,
                        fullname: guide.get('fullname'),
                    });
                }
            } catch (ex) {
                throw ex;
            }
            this.queryLocation = await this.tourService.getLocation(this.obj.info);
            for (let l = 0; l < this.queryLocation.length; l++) {
                this.listLocations.push({
                    id: this.queryLocation[l].id,
                    location: this.queryLocation[l].get('location'),
                });
            }
            for (let surcharge of this.obj.info.get('surcharge')) {
                try {
                    this.contactList.push(
                        this.formBuilder.group({
                            type: [surcharge.type],
                            price: [surcharge.price],
                        }),
                    );
                } catch (ex) {
                    console.log(ex);
                }
            }
        }

        // Phần edit/////
    }
    getListSchedule(index): FormGroup {
        const formPrivate = this.contactList1.controls[index] as FormGroup;
        return formPrivate;
    }
    createSchedule(): FormGroup {
        try {
            return this.formBuilder.group({
                startDay: ['', Validators.required],
                endDay: ['', Validators.required],
                hotel: ['', Validators.required],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    numberFormSchedule = 1;
    addContactSchedule() {
        this.arrayListGuide[this.numberFormSchedule] = new Array();
        this.contactList1.push(this.createSchedule());
        this.numberFormSchedule++;
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
    destroyGuide(n, i) {
        this.arrayListGuide[i].splice(n, 1);
    }
    removeShedule(index) {
        this.contactList1.removeAt(index);
        this.arrayListGuide.splice(index, 1);
        this.numberFormSchedule--;
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
    compareTwoDates(i) {
        console.log(this.formPrivate.value.listSchedule[i].endDay);
        this.error = { isError: false, errorMessage: '' };

        if (new Date(this.formPrivate.value.listSchedule[i].endDay) < new Date(this.formPrivate.value.listSchedule[i].startDay)) {
            this.error = { isError: true, errorMessage: 'End Date cant before start date' };
            console.log(this.error);
        }
    }
    async onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid && this.formPrivate.invalid) {
            return;
        }
        if (this.listLocations.length === 0) {
            this.requiredLocation = 'Location is required';
            return;
        } else {
            this.requiredLocation = '';
        }

        if (this.images.length === 0) {
            this.requiredImage = 'Image is required';
            return;
        } else this.requiredImage = '';

        if (this.listLocations.length > 0 && this.images.length > 0 && this.checkCode === '') {
            this.ref.close({
                value: this.registerForm.value,
                location: this.listLocations,
                schedule: this.formPrivate,
                listGuide: this.arrayListGuide,
                image: this.images,
            });
        }
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
    async checkDate(i) {
        if (this.numberRun === 0 && this.formPrivate.value.listSchedule[i].startDay && this.formPrivate.value.listSchedule[i].endDay) {
            let result = await this.guideService.findTour(
                this.formPrivate.value.listSchedule[i].startDay,
                this.formPrivate.value.listSchedule[i].endDay,
            );
            for (let n of result) {
                this.getGuides.push({
                    id: n.id,
                    fullname: n.id + ': ' + n.get('fullname'),
                });
            }
            this.go = this.formPrivate.value.listSchedule[i].startDay;
            this.end = this.formPrivate.value.listSchedule[i].endDay;
            this.numberRun = 1;
        } else {
            if (this.formPrivate.value.listSchedule[i].startDay && this.formPrivate.value.listSchedule[i].endDay) {
                if (
                    Date.parse(this.end) !== Date.parse(this.formPrivate.value.listSchedule[i].endDay) ||
                    Date.parse(this.go) !== Date.parse(this.formPrivate.value.listSchedule[i].startDay)
                ) {
                    this.go = this.formPrivate.value.listSchedule[i].startDay;
                    this.end = this.formPrivate.value.listSchedule[i].endDay;
                    this.getGuides = [];
                    let result = await this.guideService.findTour(
                        this.formPrivate.value.listSchedule[i].startDay,
                        this.formPrivate.value.listSchedule[i].endDay,
                    );
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
