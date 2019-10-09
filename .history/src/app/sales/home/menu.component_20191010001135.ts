import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./home.component.scss'],
})
export class MenuComponent implements OnInit {
    constructor(private route: Router) {}

    ngOnInit() {}
    click(id) {
        this.route.navigate(['/select-tour/' + id]);
    }
    getLocation() {}
}
