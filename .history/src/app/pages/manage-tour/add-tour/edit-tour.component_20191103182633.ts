import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { LocationService } from '../../../shared/services/location.service';
import { GuideService } from '../../../shared/services/guide.service';
import { TourService } from '../../../shared/services/tour.service';
import * as moment from 'moment';
import * as Parse from 'parse';
import { LoadingService } from '../../../shared/services/loading.service';
import { ToastrService } from '../../../shared/services';
@Component({
    selector: 'delete-tour',
    template: `
        <style>
            .footer {
                margin-top: 20px;
                border-top: 1px solid #e3e2f3;
                padding-top: 10px;
            }
            button {
                margin-left: 1em;
                width: 100px;
            }

            .btn-hint {
                background: #ebeff5;
                color: #2a2a2a;
            }
        </style>
        <nb-card style="width: 350px;height: 180px;">
            <nb-card-header>
                Delete
                <h6 class="close " aria-label="Close" (click)="dismiss()">
                    <span aria-hidden="true">&times;</span>
                </h6>
            </nb-card-header>
            <nb-card-body>
                <div>Bạn muốn ngày {{ this.startDay | date: 'short' }}</div>
                <div class="footer">
                    <button class="float-right btn btn-info" (click)="delete()">OK</button>
                    <button class="float-right  btn btn-hint" (click)="dismiss()">Cancel</button>
                </div>
            </nb-card-body>
        </nb-card>
    `,
})
export class DeleteComponent implements OnInit {
    startDay: any;
    id: string;
    constructor(protected ref: NbDialogRef<DeleteComponent>) {}
    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    async delete() {
        this.ref.close({
            id: this.id,
        });
    }
}
@Component({
    moduleId: module.id,
    selector: 'edit-tour',
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
    guideFirst: Array<any> = []; // mang huong dan vien ban dau
    locationFirst: Array<any> = []; // mang dia diem ban dau
    get contactFormGroup() {
        return this.registerForm.get('contacts') as FormArray;
    }
    tableSchedule: Array<any> = [];
    constructor(
        protected ref: NbDialogRef<EditTourComponent>,
        private completerService: CompleterService,
        private router: Router,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private guideService: GuideService,
        private tourService: TourService,
        private dialogService: NbDialogService,
        private loadingService: LoadingService,
        private toastrService: ToastrService,
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
    loading = false;
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    async ngOnInit() {
        this.getInfo();
        this.getSchedule();
    }
    numberFormSchedule = 0;
    async getInfo() {
        if (this.obj.get('saleoff') > 0) {
            this.sale = true;
        }
        this.registerForm = this.formBuilder.group({
            id: [this.obj.id],
            code: [this.obj.get('code'), Validators.required],
            nameTour: [this.obj.get('nameTour'), Validators.required],
            duration: [this.obj.get('duration'), Validators.required],
            childrenPrice: [this.obj.get('childrenPrice'), Validators.required],
            adultPrice: [this.obj.get('adultPrice'), Validators.required],
            quantity: [this.obj.get('quantity'), Validators.required],
            departure: [this.obj.get('departure'), Validators.required],
            itinerary: [this.obj.get('itinerary'), Validators.required],
            policy: [this.obj.get('policy'), Validators.required],
            vehicle: [this.obj.get('vehicle'), Validators.required],
            note: [this.obj.get('note')],
            highlights: [this.obj.get('highlights'), Validators.required],
            contacts: this.formBuilder.array([]),
            specical: [this.obj.get('specical')],
            saleoff: [this.obj.get('saleoff')],
        });
        this.contactList = this.registerForm.get('contacts') as FormArray;
        this.formPrivate = this.formBuilder.group({
            listSchedule: this.formBuilder.array([]),
        });
        this.contactList1 = this.formPrivate.get('listSchedule') as FormArray;
        this.contactList1.clear();
        this.queryLocation = await this.tourService.getLocation(this.obj);
        for (let l = 0; l < this.queryLocation.length; l++) {
            this.listLocations.push({
                id: this.queryLocation[l].id,
                location: this.queryLocation[l].get('location'),
            });
        }
        this.locationFirst = this.queryLocation;
        let images = await this.tourService.getImage(this.obj);
        for (let i = 0; i < images.length; i++) {
            this.images.push({
                imgURL: images[i].get('image').url(),
                name: images[i].get('nameFile'),
                file: images[i].get('image'),
            });
        }
        for (let surcharge of this.obj.get('surcharge')) {
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
    async getSchedule() {
        let result = await this.tourService.schedule(this.obj);
        if (result) {
            this.tableSchedule = [];
            for (let i = 0; i < result.length; i++) {
                this.queryGuide = await this.tourService.getGuide(result[i]);
                let data = [];
                for (let guide of this.queryGuide) {
                    data.push({
                        fullname: guide.get('fullname'),
                    });
                }
                this.tableSchedule.push({
                    id: result[i].id,
                    obj: result[i],
                    startDay: result[i].get('startDay'),
                    endDay: result[i].get('endDay'),
                    hotel: result[i].get('hotel'),
                    guide: data,
                });
            }
        }
        this.guideFirst = [];
    }
    async editSchedule(i) {
        this.arrayListGuide[this.numberFormSchedule] = new Array();
        try {
            this.contactList1.push(
                this.formBuilder.group({
                    id: [this.tableSchedule[i].id],
                    startDay: [this.formatDate(this.tableSchedule[i].startDay), Validators.required],
                    endDay: [this.formatDate(this.tableSchedule[i].endDay), Validators.required],
                    hotel: [this.tableSchedule[i].hotel, Validators.required],
                }),
            );
            this.queryGuide = await this.tourService.getGuide(this.tableSchedule[i].obj);
            let objGuide: Array<any> = [];
            for (let guide of this.queryGuide) {
                this.arrayListGuide[this.numberFormSchedule].push({
                    id: guide.id,
                    fullname: guide.get('fullname'),
                });
                objGuide.push(guide);
            }
            this.guideFirst[this.numberFormSchedule] = objGuide;
            this.numberFormSchedule++;
        } catch (ex) {
            throw ex;
        }
    }
    getListSchedule(index): FormGroup {
        const formPrivate = this.contactList1.controls[index] as FormGroup;
        return formPrivate;
    }
    createSchedule(): FormGroup {
        try {
            return this.formBuilder.group({
                id: [''],
                startDay: ['', Validators.required],
                endDay: ['', Validators.required],
                hotel: ['', Validators.required],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContactSchedule() {
        this.arrayListGuide[this.numberFormSchedule] = new Array();
        this.contactList1.push(this.createSchedule());
        this.guideFirst[this.numberFormSchedule] = [];
        this.numberFormSchedule++;
    }
    deleteSchedule(id, startDay, i) {
        this.dialogService
            .open(DeleteComponent, {
                context: {
                    id: id,
                    startDay: startDay,
                },
                closeOnBackdropClick: false,
            })
            .onClose.subscribe(async data => {
                {
                    try {
                        if (data) {
                            this.loadingService.start();

                            try {
                                let schedule = Parse.Object.extend('schedule');
                                const query = new Parse.Query(schedule);
                                query.equalTo('objectId', data.id);
                                let result = await query.first();
                                let succes = await result.destroy();
                                if (succes) this.tableSchedule.splice(i, 1);
                            } catch (ex) {}
                            this.loadingService.stop();
                            this.toastrService.success(`Delete Success`, 'Delete success');
                        }
                    } catch (ex) {
                        this.toastrService.error(ex, `Delete Error`);
                    }
                }
            });
    }
    async submitSchedule() {
        this.submitted = true;
        if (this.formPrivate.invalid) {
            return;
        }
        let edit = await this.tourService.editSchedule(this.formPrivate.value, this.arrayListGuide, this.guideFirst, this.obj);
        if (edit) {
            this.loadingService.start();
            this.arrayListGuide = new Array();
            this.guideFirst = [];
            this.contactList1.clear();
            await this.getSchedule();
            this.numberFormSchedule = 0;
            this.loadingService.stop();
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
    destroyGuide(n, i) {
        this.arrayListGuide[i].splice(n, 1);
    }
    removeShedule(index) {
        this.contactList1.removeAt(index);
        this.arrayListGuide.splice(index, 1);
        this.guideFirst.splice(index, 1);
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
        if (this.registerForm.invalid) {
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
            let edit = await this.tourService.editTour(this.registerForm.value, this.listLocations, this.locationFirst, this.images);
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
    removeImg(i) {
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
