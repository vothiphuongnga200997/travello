import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'ngx-add-guide',
    templateUrl: './add-guide.component.html',
    styleUrls: ['./add-guide.component.scss'],
})
export class AddGuideComponent implements OnInit {
    registerForm: FormGroup;
    title = '';
    context = '';
    constructor(protected ref: NbDialogRef<AddGuideComponent>) {}

    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
}
