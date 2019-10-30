import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            published: true,
            credentials: this.fb.array([this.addCreds()]),
        });
    }

    addCreds() {
        const creds = this.form.controls.credentials as FormArray;
        creds.push(
            this.fb.group({
                username: '',
                password: '',
            }),
        );
    }

    ngOnInit() {}
}
