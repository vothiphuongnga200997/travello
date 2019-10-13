import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services';
import { Router } from '@angular/router';
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

    ngOnInit() {
        console.log('ngOnInit');
        this.fetchAndGetUser();
        (window as any).fbAsyncInit = function() {
            FB.init({
                appId: '2310348899094477',
                cookie: true,
                xfbml: true,
                version: 'v3.1',
            });
            FB.AppEvents.logPageView();
        };
        (function(d, s, id) {
            let js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
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
    async onLoginSubmit() {
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
                    this.router.navigate(['home']);
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

    onLoginFaceBookSubmit() {
        console.log('submit login to facebook');
        // FB.login();
        FB.login(response => {
            console.log('submitLogin', response);
            if (response.authResponse) {
                console.log('login success', response.authResponse);
            } else {
                console.log('User login failed');
            }
        });
    }

    ngAfterViewInit() {
        // this.logInWithGoogle('google-login-button-sign-in');
    }

    // logInWithGoogle(buttonId) {
    //     this.authService.loginWithGoogle(
    //         buttonId,
    //         data => {
    //             if (data) {
    //                 this.ngZone.run(() => {
    //                     if (data.get('status') > 0) {
    //                         this.router.navigate(['pages']);
    //                     } else {
    //                         this.router.navigate(['home']);
    //                     }
    //                 });
    //             }
    //         },
    //         error => {
    //             this.requestPassword = (error && error.message) || 'Login error';
    //         },
    //     );
    // }
}
