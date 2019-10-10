import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../shared/services/location.service';

@Component({
    selector: 'ngx-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./home.component.scss'],
})
export class MenuComponent implements OnInit {
    constructor(private route: Router, private locationService: LocationService) {
        this.getLocation();
    }

    ngOnInit() {}
    click(id) {
        this.route.navigate(['/select-tour/' + id]);
    }
    async getLocation() {
        let result = await this.locationService.getListLocations();
        console.log(result);
    }
}
