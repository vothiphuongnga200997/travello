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
    constructor(protected ref: NbDialogRef<AddLocationComponent>) {}

    ngOnInit() {}
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
