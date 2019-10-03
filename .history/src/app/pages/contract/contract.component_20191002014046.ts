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
            fullName: ['', Validators.required],
            phone: ['', Validators.required],
            birthday: ['', Validators.required],
            address: ['', Validators.required],
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
