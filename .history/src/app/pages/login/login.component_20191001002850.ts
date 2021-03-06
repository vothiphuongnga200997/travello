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
                    alert('succes');
                    this.router.navigate(['pages']);
                }
            } catch (ex) {
                alert(ex);
                if (ex && ex.message) {
                    this.requestPassword = ex.message;
                } else {
                    this.requestPassword = 'Login error';
                }
            }
        }
    }

    ngAfterViewInit() {}

    // async logInWithMicrosoft() {
    //     try {
    //         let data = await this.authService.logInWithMicrosoft();
    //         console.log(data);
    //     } catch (ex) {
    //         this.requestPassword = (ex && ex.message) || 'Login error';
    //     }
    // }
}
