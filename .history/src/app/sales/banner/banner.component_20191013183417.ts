import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from 'parse';
@Component({
    selector: 'ngx-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
    pauseOnHover = false;
    public href: string = '';

    constructor(private router: Router) {}

    ngOnInit() {}
    async onLoginFaceBook() {
        console.log('submit login to facebook');
        this.href = this.router.url;
        console.log(this.router.url);
        // FB.login();
        /*FB.login(response => {
            console.log('submitLogin', response);
            if (response.authResponse) {
                console.log('login success', response.authResponse);
            } else {
                console.log('User login failed');
            }
        });*/
        try {
            const users = await Parse.FacebookUtils.logIn();
            console.log(users);
            if (!users.existed()) {
                alert('User signed up and logged in through Facebook!');
            } else {
                alert('User logged in through Facebook!');
                this.router.navigate(['pages']);
            }
        } catch (error) {
            alert('User cancelled the Facebook login or did not fully authorize.');
        }
    }
}
