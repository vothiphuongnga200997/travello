import { Component } from '@angular/core';

@Component({
    selector: 'ngx-stats-card-front',
    styleUrls: ['./task-guide.component.scss'],
})
export class StatsCardFrontComponent {
    flipped = false;

    toggleView() {
        this.flipped = !this.flipped;
    }
}
