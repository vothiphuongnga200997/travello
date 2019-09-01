import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder } from '@angular/forms';

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
    constructor(protected ref: NbDialogRef<AddGuideComponent>, private formBuilder: FormBuilder) {}

    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    get f() {
        return this.registerForm.controls;
    }
}
