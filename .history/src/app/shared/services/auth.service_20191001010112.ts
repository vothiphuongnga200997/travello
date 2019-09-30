import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../utils';

declare var gapi: any;

@Injectable()
export class AuthService {
    private auth2: any;
    public authenticatedSubject: Subject<boolean>;

    constructor() {
        this.authenticatedSubject = new BehaviorSubject(true);
    }

    /**
     * Check current user is authenticated
     * @returns boolean
     */
    public async isAuthenticated() {
        try {
            let currentSession = await this.checkIsValidToken();
            if (currentSession && currentSession.id) {
                return true;
            }
            return false;
        } catch (ex) {
            return false;
        }
    }

    public async checkIsValidToken() {
        let session = await Parse.Session.current();
        // let user = session.get('user');
        let domain = Utils.getDomain(location.href, false);
        document.cookie =
            'session_id=' + (session.getSessionToken() || '') + '; expires=' + session.get('expiresAt') + '; path=/; domain=' + domain;
        return session;
    }

    /**
     * Get current user object
     * @returns Parse.User
     */
    public getCurrentUser(): Parse.User {
        return Parse.User.current();
    }

    /**
     * Parse Login
     * @param userName
     * @param password
     *
     * @returns Parse.User
     */
    public async login(userName: string, password: string): Promise<Parse.User> {
        try {
            let user = await Parse.User.logIn(userName, password);
            // this.authenticatedSubject.next(true);
            return user;
        } catch (e) {
            if (e) {
                throw e;
            } else {
                throw new Error('Error login');
            }
        }
    }

    /**
     * Parse Logout
     * @returns Promise
     */
    public async logout() {
        // this.authenticatedSubject.next(false);
        try {
            return await Parse.User.logOut();
        } catch (ex) {
            return true;
        }
    }
    loginWithGoogle(googleLoginButtonId: any, success: Function, error: Function) {
        let self = this;
        gapi.load('auth2', function() {
            self.auth2 = gapi.auth2.init({
                client_id: environment.config.OAUTH_GOOGLE_CLIENT_ID,
                cookiepolicy: 'single_host_origin',
                scope: 'https://www.googleapis.com/auth/plus.login',
            });
            self.auth2.attachClickHandler(document.getElementById(googleLoginButtonId), {}, async function(loggedInUser: any) {
                let userInfo = loggedInUser.getBasicProfile();
                let authData = {
                    id: loggedInUser.getId(),
                    access_token: loggedInUser.getAuthResponse().id_token,
                    expirationDate: new Date(loggedInUser.Zi.expires_at).toJSON(),
                };
                try {
                    let user = await new Parse.User()._linkWith('google', { authData: authData });
                    user.set('lastName', userInfo.getFamilyName());
                    user.set('firstName', userInfo.getGivenName());
                    await user.save();
                    await Parse.User.become(user.get('sessionToken'));
                    success(user);
                } catch (ex) {
                    error(ex);
                }
            });
        });
    }
}
