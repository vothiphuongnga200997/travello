import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    public imagePath;
    imgURL: any;
    public message: string;

    preview(files) {
        console.log(file);
        if (files.length === 0) return;

        let mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = 'Only images are supported.';
            return;
        }

        let reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = _event => {
            this.imgURL = reader.result;
        };
    }
    constructor() {}

    ngOnInit() {}
}
