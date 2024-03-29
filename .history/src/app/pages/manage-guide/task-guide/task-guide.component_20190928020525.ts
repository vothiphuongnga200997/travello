import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { GuideService } from '../../../shared/services/guide.service';
@Component({
    selector: 'ngx-task-guide',
    templateUrl: './task-guide.component.html',
    styleUrls: ['./task-guide.component.scss'],
})
export class TaskGuideComponent implements OnInit {
    title = '';
    id: any;
    infoTour: Array<any> = [];
    constructor(public windowRef: NbWindowRef, public guideService: GuideService) {}

    ngOnInit() {
        if (this.id) {
        }
        this.getTour();
    }
    close() {
        this.windowRef.close();
    }
    async getTour() {
        let i = await this.guideService.getTour(this.id);
        if (i && i.length) {
            i.map(res => {
                this.infoTour.unshift({
                    code: res.get('code'),
                    nameTour: res.get('nameTour'),
                    startDay: res.get('startDay'),
                    endDay: res.get('endDay'),
                });
            });
        }
    }
}
