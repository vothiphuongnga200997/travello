import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../shared/services/location.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../shared/services';
import { Parse } from 'parse';
declare var FB: any;
@Component({
    selector: 'ngx-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./home.component.scss'],
})
export class MenuComponent implements OnInit {
    requestPassword = '';
    public href: string = this.router.url;
    menuLogin: boolean = true;
    menuLogout: boolean = false;
    constructor(
        private authService: AuthService,
        private router: Router,
        private locationService: LocationService,
        private modalService: NgbModal,
        private ngZone: NgZone,
    ) {
        this.getLocation();
    }
    one: Array<any> = [];
    two: Array<any> = [];
    three: Array<any> = [];
    ngOnInit() {
        this.fetchAndGetUser();
    }
    user: any;
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            this.menuLogout = true;
            this.menuLogin = false;

            currentUser = await this.authService.getCurrentUser().fetch();
            this.user = currentUser.get('fullname');
              
            };
        } else {
            this.menuLogin = true;
            this.menuLogout = false;
        }
    }
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
        this.router.navigate(['/select-tour/' + id]);
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    login() {}

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.loginGoogle('google-login-button-sign-in');
    }
    loginGoogle(buttonId) {
        this.authService.loginWithGoogle(
            buttonId,
            data => {
                if (data) {
                    this.ngZone.run(() => {
                        this.router.navigate(['this.href']);

                        // if (data.get('status') > 0) {
                        //     this.router.navigate(['pages']);
                        // } else {
                        //     this.router.navigate(['home']);
                        // }
                    });
                }
            },
            error => {
                this.requestPassword = (error && error.message) || 'Login error';
            },
        );
    }
    async loginFB() {
        console.log('submit login to facebook');
        this.href = this.router.url;
        try {
            const users = await Parse.FacebookUtils.logIn();
            if (!users.existed()) {
                alert('User signed up and logged in through Facebook!');
            } else {
                FB.api('me?fields=name', async function(response) {
                    console.log(response.name);
                    users.set('fullname', response.name);
                    await users.save();
                    await Parse.User.become(users.get('sessionToken'));
                });
                this.router.navigate(['this.href']);
            }
        } catch (error) {
            alert('Người dùng đã hủy đăng nhập Facebook.');
        }
    }
}
