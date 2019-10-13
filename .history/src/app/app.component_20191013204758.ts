/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { ParseService } from './shared/services/parse.service';
import { Parse } from 'parse';
declare var FB: any;
@Component({
    selector: 'ngx-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
    constructor(private analytics: AnalyticsService, private parseService: ParseService) {
        this.parseService.initParse();
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
        (window as any).fbAsyncInit = function() {
            /*FB.init({
                appId: '2310348899094477',
                cookie: true,
                xfbml: true,
                version: 'v3.1',
            });*/
            Parse.FacebookUtils.init({
                appId: '2310348899094477', // Facebook App ID
                status: true, // check Facebook Login status
                cookie: true, // enable cookies to allow Parse to access the session
                xfbml: true, // initialize Facebook social plugins on the page
                version: 'v3.1', // point to the latest Facebook Graph API version
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
        FB.api('/me?fields=first_name', function(response) {
            alert(response.first_name);
        });
    }
}
