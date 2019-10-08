import { Component } from '@angular/core';

@Component({
    selector: 'ngx-stats-card-front',
    styleUrls: ['./task-guide.component.scss'],
    template: `
        <div></div>
    `,
})
export class StatsCardFrontComponent {
    flipped = false;

    toggleView() {
        this.flipped = !this.flipped;
    }
}
