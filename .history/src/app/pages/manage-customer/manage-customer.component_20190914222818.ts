import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    public imagePath;
    imgURL = [];

    public message: string;

    preview(files) {
        console.log(files);
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            let mimeType = files[i].type;
            if (mimeType.match(/image\/*/) == null) {
                this.message = 'Only images are supported.';
                return;
            }

            let reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = _event => {
                this.imgURL[i] = reader.result;
            };
        }
    }
    constructor() {}

    ngOnInit() {}
}
