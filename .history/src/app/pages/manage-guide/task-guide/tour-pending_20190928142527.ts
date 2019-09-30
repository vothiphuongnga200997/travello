import { Component } from '@angular/core';

@Component({
    selector: 'ngx-profit-card',
    styleUrls: ['./task-guide.component.scss'],
})
export class StatsCardFrontComponent {
    flipped = false;

    toggleView() {
        this.flipped = !this.flipped;
    }
}
