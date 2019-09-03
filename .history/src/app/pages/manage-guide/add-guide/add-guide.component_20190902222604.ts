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
    address = '';
    birthday = new Date('2019-02-02');
    date = Date();
    i: string;
    obj: any;

    constructor(protected ref: NbDialogRef<AddGuideComponent>, private formBuilder: FormBuilder) {
        console.log('add');
    }

    ngOnInit() {
        if (this.obj) {
            this.fullName = this.obj.fullName;
            this.email = this.obj.email;
            this.phone = this.obj.phone;
            this.address = this.obj.address;
            this.date = this.obj.birthday;
            console.log(this.birthday);
        }
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
        this.birthday = new Date(this.date);
        this.ref.close({
            fullName: this.fullName,
            birthday: this.birthday,
            address: this.address,
            email: this.email,
            phone: this.phone,
        });
    }
}
