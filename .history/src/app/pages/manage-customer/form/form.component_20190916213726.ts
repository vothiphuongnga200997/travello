import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
    selector: 'ngx-form',
    template: `
        <form class="form">
            <label for="subject">Subject:</label>
            <input nbInput id="subject" type="text" />

            <label class="text-label" for="text">Text:</label>
            <textarea nbInput id="text"></textarea>
        </form>
    `,
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    constructor(public windowRef: NbWindowRef) {}
    ngOnInit() {}
    close() {
        this.windowRef.close();
    }
}
