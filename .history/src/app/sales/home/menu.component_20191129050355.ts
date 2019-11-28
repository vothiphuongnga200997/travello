import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../shared/services/location.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../shared/services';
import { Parse } from 'parse';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
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
    selector: 'ngx-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./home.component.scss'],
})
export class MenuComponent implements OnInit {
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
        private authService: AuthService,
        private router: Router,
        private locationService: LocationService,
        private modalService: NgbModal,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
    ) {
        this.getLocation();
    }
    one: Array<any> = [];
    two: Array<any> = [];
    three: Array<any> = [];
    ngOnInit() {
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
    click(content) {}
    showTour(id) {
        this.router.navigate(['/select-tour/' + id]);
    }
    openVerticallyCentered(content) {
        this.modalService.open(content, { centered: true });
    }
    async login() {
        this.requestPassword = '';
        this.requestUser = '';
        if (this.username === '') this.requestUser = 'Username is required';
        if (this.password === '') this.requestPassword = 'Password is required';
        if (this.password !== '' && this.username !== '') {
            try {
                let login = await this.authService.login(this.username, this.password);
                if (login.get('status') > 0) {
                    this.router.navigate(['pages']);
                } else {
                    this.router.navigate([this.router.url]);
                }
            } catch (ex) {
                if (ex && ex.message) {
                    this.requestPassword = ex.message;
                } else {
                    this.requestPassword = 'Login error';
                }
            }
        }
    }

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
        console.log('submit login to facebook');
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
            alert(error);
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
