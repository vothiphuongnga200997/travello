import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
})
export class BookTourComponent implements OnInit {
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    form1: boolean = true;
    form2: boolean = false;
    quantity: number;
    public contactList: FormArray;
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
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

    onFirstSubmit() {
        if (this.firstForm.invalid) {
            return;
        }
        this.firstForm.markAsDirty();
        this.quantity = this.firstForm.value.adults;
        for (let i = 0; i < this.quantity; i++) {
            this.contactList.push(this.createContact());
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
                address: [null, Validators.compose([Validators.required])],
                birthday: [null, Validators.compose([Validators.required])],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
}