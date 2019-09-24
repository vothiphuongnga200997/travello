import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
    selector: 'ngx-task-guide',
    templateUrl: './task-guide.component.html',
    styleUrls: ['./task-guide.component.scss'],
})
export class TaskGuideComponent implements OnInit {
    title = '';
    constructor(public windowRef: NbWindowRef) {}

    ngOnInit() {}
    close() {
        this.windowRef.close();
    }
}
