import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'ngx-add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
    commonSelectedItem: '';
    location: string = '';
    title: string;

    obj: any;
    constructor(protected ref: NbDialogRef<AddLocationComponent>) {}

    ngOnInit() {
        if (this.obj) {
            console.log(this.obj);
            this.location = this.obj.location;
            this.commonSelectedItem = this.obj.area;
        }
        console.log(this.commonSelectedItem);
    }
    dismiss() {
        this.ref.close();
    }
    submit() {
        this.ref.close({
            location: this.location,
            area: this.commonSelectedItem,
        });
    }
}
