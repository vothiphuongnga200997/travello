import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './edit-tour.component.html',
    styleUrls: ['./add-tour.component.scss'],
})
export class EditTourComponent implements OnInit {
    title: string;
    obj: any;
    constructor(protected ref: NbDialogRef<EditTourComponent>) {}

    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
}
