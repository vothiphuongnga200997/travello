import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-add-guide',
    templateUrl: './add-guide.component.html',
    styleUrls: ['./add-guide.component.scss'],
})
export class AddGuideComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    title = '';
    context = '';
    fullName = '';
    phone: number;
    email = '';
    // birthday = new Date('2016-05-18');
    address = '';
    date = Date;
    constructor(protected ref: NbDialogRef<AddGuideComponent>, private formBuilder: FormBuilder) {
        console.log('add');
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            birthday: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            phone: ['', Validators.required],
        });
    }
    dismiss() {
        this.ref.close();
    }
    get f() {
        return this.registerForm.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        // this.ref.close({
        //     fullName: this.fullName,
        //     birthday: this.birthday,
        //     address: this.address,
        //     email: this.email,
        //     phone: this.phone,
        // });
        // console.log(this.fullName);
        // console.log(this.phone);
        console.log(this.date);
        let birthday = new Date('2016-05-18');
        console.log(birthday);
    }
}
