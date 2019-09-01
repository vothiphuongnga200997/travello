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
    requiredLocation: String = '';
    requiredArea: String = '';

    obj: any;
    constructor(protected ref: NbDialogRef<AddLocationComponent>) {}

    ngOnInit() {
        if (this.obj) {
            this.location = this.obj.location;
            this.commonSelectedItem = this.obj.area;
        }
    }
    dismiss() {
        this.ref.close();
    }
    submit() {
        if (this.obj) {
            this.ref.close({
                id: this.obj.id,
                location: this.location,
                area: this.commonSelectedItem,
            });
        }
        this.requiredLocation = '';
        this.requiredArea = '';

        if (this.location === '') this.requiredLocation = 'Location is required';
        if (this.commonSelectedItem === '') this.requiredArea = 'Area is required';

        if (this.location !== '' && this.commonSelectedItem !== '') {
            this.ref.close({
                location: this.location,
                area: this.commonSelectedItem,
            });
        }
    }
}
