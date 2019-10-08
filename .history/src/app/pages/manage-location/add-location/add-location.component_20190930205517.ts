import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
    commonSelectedItem: string = '';
    location: string = '';
    title: string;
    requiredLocation: String = '';
    requiredArea: String = '';
    registerForm: FormGroup;
    submitted = false;
    obj: any;
    constructor(protected ref: NbDialogRef<AddLocationComponent>, private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        });
        if (this.obj) {
            this.location = this.obj.location;
            this.commonSelectedItem = this.obj.area;
        }
    }
    dismiss() {
        this.ref.close();
    }
    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
    }
    submit() {
        if (this.obj) {
            this.ref.close({
                id: this.obj.id,
                location: this.location,
                area: this.commonSelectedItem,
            });
        }
        this.requiredLocation = '';
        this.requiredArea = '';
        if (this.location === '') this.requiredLocation = 'Location is required';
        if (this.commonSelectedItem === '') this.requiredArea = 'Area is required';
        if (this.location !== '' && this.commonSelectedItem !== '') {
            this.ref.close({
                location: this.location,
                area: this.commonSelectedItem,
            });
        }
    }
}
