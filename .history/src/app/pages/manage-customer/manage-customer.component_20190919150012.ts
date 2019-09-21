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
    config: any;
    constructor() {
        this.mycontent = `<p>My html content</p>`;
        this.config = {
            uiColor: '#CCEAEE', // This is to set editor color https://ckeditor.com/docs/ckeditor4/latest/examples/uicolor.html
            toolbarGroups: [
                // Configure Different elements present in Editor
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
                { name: 'links' },
                { name: 'insert' },
                { name: 'document', groups: ['mode', 'document', 'doctools'] },
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
                { name: 'styles' },
                { name: 'colors' },
            ],
            resize_enabled: false,
            height: 500, // Setting height
        };
    }

    ngOnInit() {
        this.ckeConfig = {
            allowedContent: false,
            extraPlugins: 'divarea',
            forcePasteAsPlainText: true,
        };
    }

    onChange($event: any): void {
        console.log('onChange');
    }

    onPaste($event: any): void {
        console.log('onPaste');
    }
}
