import { Component } from '@angular/core';

@Component({
    selector: 'ngx-profit-card',
    styleUrls: ['./profit-card.component.scss'],
    templateUrl: './profit-card.component.html',
})
export class StatsCardFrontComponent {
    flipped = false;

    toggleView() {
        this.flipped = !this.flipped;
    }
}
