import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    orderForm: FormGroup;
    items: FormArray;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.orderForm = this.formBuilder.group({
            customerName: '',
            email: '',
            items: this.formBuilder.array([this.createItem()]),
        });
    }
    createItem(): FormGroup {
        return this.formBuilder.group({
            name: '',
            description: '',
            price: '',
        });
    }
    addItem(): void {
        this.items = this.orderForm.get('items') as FormArray;
        this.items.push(this.createItem());
    }
}
