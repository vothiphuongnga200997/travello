import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
})
export class BookTourComponent implements OnInit {
    check: string;
    firstFormRegistration: FormGroup;
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    form1: boolean = true;
    form2: boolean = false;
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.secondForm = this.fb.group({
            secondCtrl: ['', Validators.required],
        });

        this.thirdForm = this.fb.group({
            thirdCtrl: ['', Validators.required],
        });
        this.checkForm1();
    }
    checkForm1() {
        this.form2 = false;
        this.form1 = true;
        this.firstForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            check: ['', Validators.required],
        });
    }
    checkForm2() {
        this.form2 = true;
        this.form1 = false;
        this.firstForm = this.fb.group({
            username1: ['', Validators.required],
            password1: ['', Validators.required],
            check: ['', Validators.required],
        });
    }
    onFirstSubmit() {
        this.firstForm.markAsDirty();
        this.check = '11';
        console.log(this.firstForm.value.check);
    }
    onfirstFormRegistrationSubmit() {
        this.firstFormRegistration.markAsDirty();
    }
    onSecondSubmit() {
        this.secondForm.markAsDirty();
    }

    onThirdSubmit() {
        this.thirdForm.markAsDirty();
    }
}
