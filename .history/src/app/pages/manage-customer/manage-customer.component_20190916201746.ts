import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
    fileName: string;

    public imagePath;
    images: Array<any> = [];
    public message: string;

    constructor() {}

    ngOnInit() {}
    preview(files) {
        console.log(files);
        this.fileName = files.length + 'files';
        let jobApplication = new Parse.Object('imagesTour');
        if (files.length === 0) return;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let mimeType = files[i].type;
                if (mimeType.match(/image\/*/) == null) {
                    this.message = 'Only images are supported.';
                    return;
                }

                let reader = new FileReader();
                this.imagePath = files;
                reader.readAsDataURL(files[i]);
                reader.onload = _event => {
                    this.images.unshift({
                        imgURL: reader.result,
                    });
                };
                // let name = files[0].name;
                // let parseFile = new Parse.File(name, files[0]);
                // jobApplication.set('image', parseFile);
                // jobApplication.save();
            }
        }
    }
    destroy(i) {
        this.images.splice(i, 1);
    }
    openInputFile() {
        this.inputFile.nativeElement.click();
    }
    fileChangeEvent(event) {
        console.log(event);
        this.fileName = this.inputFile.nativeElement.files[0].name;
    }
}
