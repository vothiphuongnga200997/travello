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
        if (this.obj) {
            this.location = this.obj.location;
            this.commonSelectedItem = this.obj.area;
        }
    }
    dismiss() {
        this.ref.close();
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
        if (this.location === '') this.requiredLocation = 'Vui lòng điền địa điểm';
        if (this.commonSelectedItem === '') this.requiredArea = 'Vui lòng chọn khu vực';
        if (this.location !== '' && this.commonSelectedItem !== '') {
            this.ref.close({
                location: this.location,
                area: this.commonSelectedItem,
            });
        }
    }
}
