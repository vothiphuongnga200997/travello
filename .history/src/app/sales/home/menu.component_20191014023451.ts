import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../shared/services/location.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'ngx-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./home.component.scss'],
})
export class MenuComponent implements OnInit {
    constructor(private route: Router, private locationService: LocationService, private modalService: NgbModal) {
        this.getLocation();
    }
    one: Array<any> = [];
    two: Array<any> = [];
    three: Array<any> = [];
    ngOnInit() {}
    click(id) {}
    async getLocation() {
        let result = await this.locationService.getListLocations();
        for (let i of result) {
            if (i.get('area') === 1) {
                this.one.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
            if (i.get('area') === 2) {
                this.two.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
            if (i.get('area') === 3) {
                this.three.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
        }
    }
    showTour(id) {
        this.route.navigate(['/select-tour/' + id]);
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    login() {}
    loginGoogle() {
        alert('logon gg');
    }
    loginFB() {
        alert('login FB');
    }
}
