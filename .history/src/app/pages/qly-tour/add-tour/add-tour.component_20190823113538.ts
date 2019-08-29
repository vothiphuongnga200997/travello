import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
@Component({
    selector: 'ngx-add-tour',
    templateUrl: './add-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
    title: string;
    stateForm: FormGroup;

    showDropDown = false;

    constructor(private fb: FormBuilder) {
        this.initForm();
    }
    initForm(): FormGroup {
        return (this.stateForm = this.fb.group({
            search: [null],
        }));
    }
    ngOnInit() {}
}
