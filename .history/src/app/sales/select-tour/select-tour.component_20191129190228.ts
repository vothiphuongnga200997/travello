import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Parse from 'parse';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services';
import { LocationService } from '../../shared/services/location.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../shared/services/loading.service';
declare var FB: any;
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
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
    requestUser: string;
    username: string;
    password: string;
    registerForm: FormGroup;
    submitted = false;
    get f() {
        return this.registerForm.controls;
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private locationService: LocationService,
        private modalService: NgbModal,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private formBuilder: FormBuilder,
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
        this.fetchAndGetUser();
        this.registerForm = this.formBuilder.group(
            {
                fullname: ['', Validators.required],
                phone: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                username: ['', Validators.required],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required],
            },
            {
                validator: MustMatch('password', 'confirmPassword'),
            },
        );
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
                    specical: data.get('specical'),
                });
            }
        }
        this.loadingService.stop();
    }
    readMore(id) {
        this.router.navigate(['/detail/' + id]);
    }

    user: any; // username login
    idUser: string; // id user login
    change() {
        this.requestUser = '';
        this.requestPassword = '';
        if (this.username === '') this.requestUser = 'Vui lòng nhập tài khoản';
        if (this.password === '') this.requestPassword = 'Vui lòng nhập mật khẩu';
    }
    async onSubmit(content) {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        } else {
            try {
                let user = await new Parse.User();
                user.set('fullname', this.registerForm.value.fullname);
                user.set('email', this.registerForm.value.email);
                user.set('username', this.registerForm.value.username);
                user.set('password', this.registerForm.value.password);
                user.set('phone', this.registerForm.value.phone);
                user.set('status', -1);
                let objUser = await user.save();
                if (objUser) {
                    alert('thanh cong');
                    let login = await Parse.User.logIn(this.registerForm.value.username, this.registerForm.value.password);
                    if (login) {
                        this.fetchAndGetUser();
                        this.modalService.dismissAll(content);
                    }
                }
            } catch (ex) {
                console.log(ex);
            }
        }
    }
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
    click(content) {}
    showTour(id) {
        this.router.navigate(['/select-tour/' + id]);
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    async login(content) {
        this.requestPassword = '';
        this.requestUser = '';
        if (this.username === '') this.requestUser = 'Vui lòng nhập tài khoản';
        if (this.password === '') this.requestPassword = 'Vui lòng nhập mật khẩu';
        if (this.password !== '' && this.username !== '') {
            try {
                let login = await this.authService.login(this.username, this.password);
                if (login.get('status') > 0) {
                    this.router.navigate(['pages']);
                } else {
                    this.fetchAndGetUser();
                    this.modalService.dismissAll(content);
                }
            } catch (ex) {
                if (ex && ex.message) {
                    this.requestPassword = 'Đăng nhập không thành công vui lòng kiểm tra lại!';
                } else {
                    this.requestPassword = 'Login error';
                }
            }
        }
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.loginGoogle('google-login-button-sign-in', 'content');
    }
    loginGoogle(buttonId, content) {
        this.authService.loginWithGoogle(
            buttonId,
            data => {
                if (data) {
                    this.ngZone.run(() => {
                        this.modalService.dismissAll(content);
                        this.fetchAndGetUser();
                    });
                }
            },
            error => {
                this.requestPassword = (error && error.message) || 'Login error';
            },
        );
    }
    async loginFB(content) {
        try {
            const users = await Parse.FacebookUtils.logIn();
            if (!users.existed()) {
            } else {
                await FB.api('me?fields:name', async function(response) {
                    await users.set('fullname', response.name);
                    await users.set('status', -1);
                    await users.save();
                    await Parse.User.become(users.get('sessionToken'));
                });
                this.modalService.dismissAll(content);
                this.fetchAndGetUser();
            }
        } catch (error) {}
    }
    async logout() {
        try {
            await this.authService.logout();
            this.router.navigate(['home']);
            this.fetchAndGetUser();
        } catch (ex) {
            console.log('Đăng xuất không thành công');
        }
    }
    watchInfo() {
        this.router.navigate(['watch-info/' + this.idUser]);
    }
}
