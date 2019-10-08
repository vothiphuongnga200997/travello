import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
    registerForm: FormGroup;

    constructor(private dialogService: NbDialogService, private formBuilder: FormBuilder) {
        console.log('dgdg');
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            code: ['', Validators.required],
            nameTour: ['', Validators.required],
            duration: ['', Validators.required],
            hotel: ['', Validators.required],
            childrenPrice: ['', Validators.required],
            adultPrice: ['', Validators.required],
            startDay: ['', Validators.required],
            endDay: ['', Validators.required],
            quantity: ['', Validators.required],
            departure: ['', Validators.required],
            itinerary: ['', Validators.required],
            guide: ['', Validators.required],
            note: [''],
        });
    }
    get f() {
        return this.registerForm.controls;
    }
    async addCustom() {
        console.log('hihih');
        try {
            this.dialogService.open(AddCustomerComponent, {
                context: {
                    title: 'Create',
                },
            });
        } catch (ex) {
            console.log(ex);
        }
        // .onClose.subscribe();
    }
}
