import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NbDialogRef, NbWindowRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LoadingService } from '../../../shared/services';
import { GuideService } from '../../../shared/services/guide.service';

@Component({
    selector: 'ngx-add-guide',
    templateUrl: './add-guide.component.html',
    styleUrls: ['./add-guide.component.scss'],
})
export class AddGuideComponent implements OnInit {
    @Output() pen = new EventEmitter<any>();
    registerForm: FormGroup;
    submitted = false;
    title = '';
    context = '';
    fullName = '';
    phone: number;
    email = '';
    address = '';
    birthday = new Date();
    date: any;
    obj: any;
    loadingMediumGroup = false;

    constructor(public windowRef: NbWindowRef, private formBuilder: FormBuilder, private guideService: GuideService) {}
    ngOnInit() {
        if (this.obj) {
            this.fullName = this.obj.fullName;
            this.email = this.obj.email;
            this.phone = this.obj.phone;
            this.address = this.obj.address;
            let momentObj = moment(this.obj.date);
            this.date = momentObj.format('YYYY-MM-DD');
            console.log(this.date);
        }
        this.registerForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            birthday: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            phone: ['', Validators.required],
        });
    }
    // dismiss() {
    //     this.ref.close();
    // }
    close() {
        this.windowRef.close();
    }
    get f() {
        return this.registerForm.controls;
    }
    async onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        } else {
            this.windowRef.close();
            this.birthday = new Date(this.date);
            let i = await this.guideService.addGuide(this.fullName, this.email, this.address, this.phone, this.birthday);
            this.pen.next('pen nek');
        }
        // if (this.obj) {
        //     this.ref.close({
        //         id: this.obj.id,
        //         fullName: this.fullName,
        //         birthday: this.birthday,
        //         address: this.address,
        //         email: this.email,
        //         phone: this.phone,
        //     });
        // }
        // this.ref.close({
        //     fullName: this.fullName,
        //     birthday: this.birthday,
        //     address: this.address,
        //     email: this.email,
        //     phone: this.phone,
        // });
    }
}
