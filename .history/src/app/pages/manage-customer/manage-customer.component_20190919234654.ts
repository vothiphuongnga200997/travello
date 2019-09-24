import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    @ViewChild('myckeditor', { static: true }) ckeditor: any;

    constructor() {}

    ngOnInit() {
        this.ckeConfig = {
            allowedContent: false,
            extraPlugins: 'divarea',
            forcePasteAsPlainText: true,
        };
    }

    onChange($event: any): void {
        console.log(event);
    }

    onPaste($event: any): void {
        console.log(event);
    }
}
