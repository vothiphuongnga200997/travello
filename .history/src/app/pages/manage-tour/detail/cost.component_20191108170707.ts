import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-cost',
    templateUrl: './cost.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class CostComponent implements OnInit {
    submitted: boolean = false;
    formPrivate: FormGroup;
    public contactList1: FormArray;
    objSchedule: any;
    get contactFormPrivate() {
        return this.formPrivate.get('listSchedule') as FormArray;
    }
    constructor(private formBuilder: FormBuilder) {}
    ngOnInit() {
        if(this.objSchedule !== undefined && this.objSchedule !== null){
            this.formPrivate = this.formBuilder.group({
                listSchedule: this.formBuilder.array([]),
            });
            this.contactList1 = this.formPrivate.get('listSchedule') as FormArray;
        }
        this.getCost();
        else{
            this.formPrivate = this.formBuilder.group({
                listSchedule: this.formBuilder.array([this.createSchedule()]),
            });
            this.contactList1 = this.formPrivate.get('listSchedule') as FormArray;
        }
       
    }
    getListSchedule(index): FormGroup {
        const formPrivate = this.contactList1.controls[index] as FormGroup;
        return formPrivate;
    }
    createSchedule(): FormGroup {
        try {
            return this.formBuilder.group({
                content: [null, Validators.required],
                money: [null, Validators.required],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    addContactSchedule() {
        this.contactList1.push(this.createSchedule());
    }
    async removeContact(index) {
        this.contactList1.removeAt(index);
    }
    async submit() {
        this.submitted = true;
        if (this.formPrivate.invalid) {
            return;
        }
        let tourCost = Parse.Object.extend('tourCost');
        let obj = new tourCost();
        let dataSave: any = {};
        dataSave.objSchedule = this.objSchedule;
        dataSave.cost = this.formPrivate.value.listSchedule;
        await obj.save(dataSave);
    }
    async getCost() {
        let tourCost = Parse.Object.extend('tourCost');
        const query = new Parse.Query(tourCost);
        query.equalTo('objSchedule', this.objSchedule);
        let result = await query.first();
        for (let i of result.get('cost')) {
            try {
                this.contactList1.push(
                    this.formBuilder.group({
                        content: [i.content, Validators.required],
                        money: [i.money, Validators.required],
                    }),
                );
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}
