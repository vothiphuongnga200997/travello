import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
    fileName: string = 'Upload your file';

    public imagePath;
    imgURL = [];
    images: Array<any> = [];
    public message: string;

    preview(files) {
        console.log(files);
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
                    this.imgURL[i] = reader.result;
                };
            }
        }
    }
    constructor() {}

    ngOnInit() {}

    openInputFile() {
        this.inputFile.nativeElement.click();
    }
    fileChangeEvent(event) {
        console.log(event);
        this.fileName = this.inputFile.nativeElement.files[0].name;
    }
}
