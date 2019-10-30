import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    secondForm: FormGroup;
    public contactList: FormArray;
    get contactFormGroup() {
        return this.secondForm.get('contacts') as FormArray;
    }
    constructor(private formBuilder: FormBuilder) {}
    ngOnInit() {
        this.secondForm = this.formBuilder.group({
            contacts: this.formBuilder.array([this.create()]),
        });
        this.contactList = this.secondForm.get('contacts') as FormArray;
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
        this.contactList.push(this.create());
    }
}
