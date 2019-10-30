import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    formPrivate: FormGroup;
    public contactList1: FormArray;
    get contactFormPrivate() {
        return this.formPrivate.get('listSchedule') as FormArray;
    }
    constructor(private formBuilder: FormBuilder) {}
    ngOnInit() {
        this.formPrivate = this.formBuilder.group({
            listSchedule: this.formBuilder.array([this.create()]),
        });
        this.contactList1 = this.formPrivate.get('listSchedule') as FormArray;
    }

    create(): FormGroup {
        try {
            return this.formBuilder.group({
                name: [null],
                phonecustomer: [null],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContact() {
        this.contactList1.push(this.create());
    }
}
