import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'ngx-cost',
    templateUrl: './cost.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class CostComponent implements OnInit {
    formPrivate: FormGroup;
    public contactList1: FormArray;
    constructor(private formBuilder: FormBuilder) {}
    ngOnInit() {
        this.formPrivate = this.formBuilder.group({
            listSchedule: this.formBuilder.array([this.createSchedule()]),
        });
        this.contactList1 = this.formPrivate.get('listSchedule') as FormArray;
    }
    getListSchedule(index): FormGroup {
        const formPrivate = this.contactList1.controls[index] as FormGroup;
        return formPrivate;
    }
    createSchedule(): FormGroup {
        try {
            return this.formBuilder.group({
                name: [null, Validators.required],
                phonecustomer: [null],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContactSchedule() {
        this.contactList1.push(this.createSchedule());
    }
}