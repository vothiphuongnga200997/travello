import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services';
import { Router } from '@angular/router';
import { Parse } from 'parse';
declare var FB: any;
@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
    public username: string;
    public password: string;
    requestUser = '';
    requestPassword = '';
    constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {}
    public href: string = '';

    ngOnInit() {
        console.log('ngOnInit');
        this.fetchAndGetUser();
    }
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            if (currentUser.get('status') > 0) {
                this.router.navigate(['pages']);
            } else {
                this.router.navigate(['home']);
            }
        }
    }
    async onLoginFaceBookSubmit() {
        console.log('submit login to facebook');
        this.href = this.router.url;
        console.log(this.router.url);

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
                this.router.navigate(['pages']);
            }
        } catch (error) {
            alert('Người dùng đã hủy đăng nhập Facebook .');
        }
    }

    async onLoginSubmit() {
        this.requestPassword = '';
        this.requestUser = '';
        if (this.username === '') this.requestUser = 'Username is required';
        if (this.password === '') this.requestPassword = 'Password is required';
        if (this.password !== '' && this.username !== '') {
            try {
                let login = await this.authService.login(this.username, this.password);
                this.router.navigate(['pages']);

                // if (login.get('status') > 0) {
                //     this.router.navigate(['pages']);
                // } else {
                //     this.router.navigate(['home']);
                // }
            } catch (ex) {
                if (ex && ex.message) {
                    this.requestPassword = ex.message;
                } else {
                    this.requestPassword = 'Login error';
                }
            }
        }
    }

    ngAfterViewInit() {
        this.logInWithGoogle('google-login-button-sign-in');
    }

    logInWithGoogle(buttonId) {
        alert('tao ne');
        this.authService.loginWithGoogle(
            buttonId,
            data => {
                if (data) {
                    this.ngZone.run(() => {
                        this.router.navigate(['pages']);

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
}
