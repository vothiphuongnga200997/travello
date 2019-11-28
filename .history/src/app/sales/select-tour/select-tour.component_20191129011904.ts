import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import * as Parse from 'parse';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services';
import { LocationService } from '../../shared/services/location.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../shared/services/loading.service';
declare var FB: any;

@Component({
    selector: 'ngx-select-tour',
    templateUrl: './select-tour.component.html',
    styleUrls: ['./select-tour.component.scss'],
})
export class SelectTourComponent implements OnInit {
    listTour: Array<any>;
    requestPassword = '';
    menuLogin: boolean = true;
    menuLogout: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private locationService: LocationService,
        private modalService: NgbModal,
        private ngZone: NgZone,
        private loadingService: LoadingService,
    ) {
        this.id = this.route.snapshot.paramMap.get('id');
        this.getLocation();
    }
    one: Array<any> = [];
    two: Array<any> = [];
    three: Array<any> = [];
    id = '';
    validatingForm: FormGroup;
    location: String;
    ngOnInit() {
        this.getTour();
    }

    async getTour() {
        this.listTour = [];
        const currentDate = new Date(
            moment(Date.now())
                .add(3, 'day')
                .format('LLL'),
        );
        this.loadingService.start();
        const location = Parse.Object.extend('location');
        const queryLoation = new Parse.Query(location);
        queryLoation.equalTo('objectId', this.id);
        let objLocation = await queryLoation.first();
        this.location = objLocation.get('location');
        let query = new Parse.Query('tour');
        query.equalTo('locations', objLocation);

        let querySchedule = new Parse.Query('schedule');
        let queryImg = new Parse.Query('imagesTour');
        let result = await query.find();
        for (let data of result) {
            let locationRelation = data.relation('locations');
            let resultLocation = await locationRelation.query().find();
            let listLocation = [];
            for (let dataLocation of resultLocation) {
                await listLocation.push(dataLocation.get('location'));
            }
            querySchedule.equalTo('objTour', data);
            querySchedule.greaterThan('startDay', currentDate);
            querySchedule.greaterThan('empty', 0);
            queryImg.equalTo('idTour', data);
            let resultImg = await queryImg.first();
            console.log(resultImg);
            let resultSchedule = await querySchedule.first();

            if (resultSchedule !== undefined) {
                this.listTour.push({
                    id: data.id,
                    nameTour: data.get('nameTour'),
                    hightLight: data.get('highlights'),
                    location: listLocation,
                    image: resultImg.attributes.image._url,
                    vehicle: data.get('vehicle'),
                    duration: data.get('duration'),
                    departure: data.get('departure'),
                    saleoff: data.get('saleoff'),
                    adultPrice: data.get('adultPrice') - data.get('saleoff'),
                    startDay: moment(resultSchedule.get('startDay')).format('DD/MM/YYYY'),
                    endDay: moment(resultSchedule.get('endDay')).format('DD/MM/YYYY'),
                });
            }
        }
        this.loadingService.stop();    }
    readMore(id) {
        this.router.navigate(['/detail/' + id]);
    }

    user: any; // username login
    idUser: string; // id user login
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            this.menuLogout = true;
            this.menuLogin = false;

            currentUser = await this.authService.getCurrentUser().fetch();
            this.user = currentUser.get('fullname');
            this.idUser = currentUser.id;
        } else {
            this.menuLogin = true;
            this.menuLogout = false;
        }
    }
    async getLocation() {
        let result = await this.locationService.getListLocations();
        for (let i of result) {
            if (i.get('area') === 'Miền Bắc') {
                this.one.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
            if (i.get('area') === 'Miền Nam') {
                this.two.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
            if (i.get('area') === 'Miền Trung') {
                this.three.push({
                    location: i.get('location'),
                    id: i.id,
                });
            }
        }
    }
    async showTour(id) {
        this.id = id;
        await this.getTour();
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
                        this.router.navigate([this.router.url]);
                        this.fetchAndGetUser();
                    });
                }
            },
            error => {
                this.requestPassword = (error && error.message) || 'Login error';
            },
        );
    }
    async loginFB() {
        try {
            const users = await Parse.FacebookUtils.logIn();
            if (!users.existed()) {
                alert('User signed up and logged in through Facebook!');
            } else {
                await FB.api('me?fields:name', async function(response) {
                    await users.set('fullname', response.name);
                    await users.set('status', -1);
                    await users.save();
                    await Parse.User.become(users.get('sessionToken'));
                });
                this.router.navigate([this.router.url]);
                this.fetchAndGetUser();
            }
        } catch (error) {
            alert('Người dùng đã hủy đăng nhập Facebook.');
        }
    }
    async logout() {
        try {
            await this.authService.logout();
            this.router.navigate(['home']);
            this.fetchAndGetUser();
        } catch (ex) {
            alert('Đăng xuất không thành công');
        }
    }
    watchInfo() {
        this.router.navigate(['watch-info/' + this.idUser]);
    }
}
