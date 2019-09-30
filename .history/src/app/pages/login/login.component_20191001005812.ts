import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services';
import { Router } from '@angular/router';

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
    }
    async onLoginSubmit() {
        this.requestPassword = '';
        this.requestUser = '';
        if (this.username === '') this.requestUser = 'Username is required';
        if (this.password === '') this.requestPassword = 'Password is required';
        if (this.password !== '' && this.username !== '') {
            try {
                let login = await this.authService.login(this.username, this.password);
                if (login) {
                    this.router.navigate(['pages']);
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

    ngAfterViewInit() {
        this.logInWithGoogle('google-login-button-sign-in');
    }

    // async logInWithMicrosoft() {
    //     try {
    //         let data = await this.authService.logInWithMicrosoft();
    //         console.log(data);
    //     } catch (ex) {
    //         this.requestPassword = (ex && ex.message) || 'Login error';
    //     }
    // }
    logInWithGoogle(buttonId) {
        this.authService.loginWithGoogle(
            buttonId,
            data => {
                if (data) {
                    this.ngZone.run(() => {
                        this.router.navigate(['pages']);
                    });
                }
            },
            error => {
                this.requestPassword = (error && error.message) || 'Login error';
            },
        );
    }
}
