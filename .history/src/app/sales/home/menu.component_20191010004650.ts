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
    one: Array<any> = [];
    two: Array<any> = [];
    three: Array<any> = [];
    ngOnInit() {}
    click(id) {
        this.route.navigate(['/select-tour/' + id]);
    }
    async getLocation() {
        let result = await this.locationService.getListLocations();
        console.log(result);
        for (let i of result) {
            if (i.get('area') === 0) {
                this.one.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
            console.log(this.one);
        }
    }
}
