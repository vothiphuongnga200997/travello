import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Parse } from 'parse';
declare var FB: any;
@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
    id: string;
    title: string = '';
    public username: string;
    public password: string;
    requestUser = '';
    requestPassword = '';
    loading = false;
    constructor(private authService: AuthService, private router: Router, private ngZone: NgZone, private route: ActivatedRoute) {}
    public href: string = '';

    ngOnInit() {
        console.log('ngOnInit');
        this.id = this.route.snapshot.paramMap.get('id');
        this.fetchAndGetUser();

        if (this.id) {
            this.title = 'Bạn vui lòng đăng nhập/đăng kí';
        }
    }
    toggleLoadingAnimation() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 1000);
    }
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            if (currentUser.get('status') > 0 && this.id === '') {
                this.router.navigate(['pages']);
            }
            if (currentUser.get('status') < 0 && this.id !== '') {
                this.router.navigate(['/sales/book-tour/' + this.id]);
            }
        }
    }
    async onLoginFaceBookSubmit() {
        this.href = this.router.url;

        try {
            const users = await Parse.FacebookUtils.logIn();
            if (!users.existed()) {
                alert('User signed up and logged in through Facebook!');
            } else {
                FB.api('me?fields=name', async function(response) {
                    console.log(response.name);
                    users.set('fullname', response.name);
                    users.set('status', -1);
                    await users.save();
                    await Parse.User.become(users.get('sessionToken'));
                });
                this.router.navigate(['/sales/book-tour/' + this.id]);
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
                if (login.get('status') > 0) {
                    this.router.navigate(['pages']);
                } else {
                    this.router.navigate(['/sales/book-tour/' + this.id]);
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

    logInWithGoogle(buttonId) {
        this.authService.loginWithGoogle(
            buttonId,
            data => {
                if (data) {
                    this.ngZone.run(() => {
                        this.router.navigate(['pages']);

                        if (data.get('status') > 0) {
                            this.router.navigate(['pages']);
                        } else {
                            this.router.navigate(['/sales/book-tour/' + this.id]);
                        }
                    });
                }
            },
            error => {
                this.requestPassword = (error && error.message) || 'Login error';
            },
        );
    }
}
