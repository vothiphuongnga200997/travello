import { Component, OnInit } from '@angular/core';
import { AddTourComponent } from '../../qly-tour/add-tour/add-tour.component';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'ngx-add-dia-diem',
    templateUrl: './add-dia-diem.component.html',
    styleUrls: ['./add-dia-diem.component.scss'],
})
export class AddDiaDiemComponent implements OnInit {
    commonSelectedItem: '';
    location: string = '';
    area: string = '';
    title: string;
    constructor(protected ref: NbDialogRef<AddTourComponent>) {}

    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
    submit() {}
}
