import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
    selector: 'ngx-task-guide',
    templateUrl: './task-guide.component.html',
    styleUrls: ['./task-guide.component.scss'],
})
export class TaskGuideComponent implements OnInit {
    title = '';
    id: any;
    constructor(public windowRef: NbWindowRef) {}

    ngOnInit() {
        if (this.id) {
            console.log(this.id);
        }
    }
    close() {
        this.windowRef.close();
    }
    async getTour() {}
}
