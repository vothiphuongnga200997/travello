import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbWindowRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LoadingService } from '../../../shared/services';

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
    fullname = '';
    phone: number;
    email = '';
    address = '';
    birthday = new Date();
    date: any;
    obj: any;
    loadingMediumGroup = false;

    constructor(protected ref: NbDialogRef<AddGuideComponent>, private formBuilder: FormBuilder) {}
    ngOnInit() {
        if (this.obj) {
            this.fullname = this.obj.fullname;
            this.email = this.obj.email;
            this.phone = this.obj.phone;
            this.address = this.obj.address;
            let momentObj = moment(this.obj.date);
            this.date = momentObj.format('YYYY-MM-DD');
        }
        this.registerForm = this.formBuilder.group({
            fullname: ['', Validators.required],
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
        if (this.obj) {
            this.ref.close({
                id: this.obj.id,
                fullname: this.fullname,
                birthday: this.birthday,
                address: this.address,
                email: this.email,
                phone: this.phone,
            });
        }
        this.ref.close({
            fullname: this.fullname,
            birthday: this.birthday,
            address: this.address,
            email: this.email,
            phone: this.phone,
        });
    }
}
