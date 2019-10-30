import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    demoForm: FormGroup;
    arrayItems: {
        id: number;
        title: string;
    }[];
    get demoArray() {
        return this.demoForm.get('demoArray') as FormArray;
    }
    addItem(item) {
        this.arrayItems.push(item);
        this.demoArray.push(this._formBuilder.control(false));
    }
    removeItem() {
        this.arrayItems.pop();
        this.demoArray.removeAt(this.demoArray.length - 1);
    }
    constructor(private _formBuilder: FormBuilder) {
        this.demoForm = this._formBuilder.group({
            demoArray: this._formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.arrayItems = [];
    }
}
