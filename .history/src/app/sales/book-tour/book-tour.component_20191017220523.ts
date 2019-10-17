import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IPayPalConfig } from 'ngx-paypal';
import { Router } from '@angular/router';
import { Parse } from 'parse';
import { AuthService } from '../../shared/services';
import { TourService } from '../../shared/services/tour.service';
declare var FB: any;
@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
})
export class BookTourComponent implements OnInit {
    idURL: string;
    public payPalConfig?: IPayPalConfig;
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    form1: boolean = true;
    form2: boolean = false;
    quantity: number;
    public contactList: FormArray;
    get contactFormGroup() {
        return this.secondForm.get('contacts') as FormArray;
    }
    pauseOnHover = false;
    public href: string = '';
    constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private tourService: TourService) {
        console.log('book');
    }

    ngOnInit() {
        this.fetchAndGetUser();

        this.firstForm = this.fb.group({
            adults: ['', Validators.required],
            children: [''],
            sales: [''],
        });
        this.secondForm = this.fb.group({
            contacts: this.fb.array([this.createContact()]),
        });
        this.contactList = this.secondForm.get('contacts') as FormArray;

        this.thirdForm = this.fb.group({
            thirdCtrl: ['', Validators.required],
        });
    }
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.router.navigate(['home']);
        }
    }
    i: number = 0;
    onFirstSubmit() {
        if (this.firstForm.invalid) {
            return;
        }
        this.firstForm.markAsDirty();
        if (this.i === 0) {
            this.quantity = this.firstForm.value.adults;
            for (let i = 0; i < this.quantity - 1; i++) {
                this.contactList.push(this.createContact());
            }
            this.i++;
        } else {
            if (this.quantity === this.firstForm.value.adults) return;
            else {
                this.secondForm.removeControl('contacts');
                this.secondForm = this.fb.group({
                    contacts: this.fb.array([this.createContact()]),
                });
                this.contactList = this.secondForm.get('contacts') as FormArray;

                for (let i = 0; i < this.firstForm.value.adults - 1; i++) {
                    this.contactList.push(this.createContact());
                }
                this.quantity = this.firstForm.value.adults;
            }
        }
    }

    onSecondSubmit() {
        this.secondForm.markAsDirty();
    }

    onThirdSubmit() {
        this.thirdForm.markAsDirty();
    }

    createContact(): FormGroup {
        try {
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
                address: [null],
                gender: [null],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    async getTour() {
        this.tourService.queryTour(this.id);
    }
}
