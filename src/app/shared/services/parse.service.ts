import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { environment } from '../../../environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ParseService {
    private validTokenSubject: Subject<boolean>;
    constructor(public router: Router) {}
    public initParse() {
        Parse.initialize(environment.config.APP_ID);
        Parse.serverURL = environment.config.SERVER_URL;
        (window as any).Parse = Parse;
        this.validTokenSubject = new BehaviorSubject(!!Parse.User.current());
    }

    public getValidTokenSubject() {
        return this.validTokenSubject;
    }

    /**
     * Execute a cloud code
     * @param cloudName Cloud code name
     * @param params params for this cloud code
     */
    public async executeCloudCode(cloudName: string, params: { [key: string]: any }): Promise<any> {
        try {
            return await Parse.Cloud.run(cloudName, params);
        } catch (e) {
            throw this.handleParseError(e);
        }
    }

    /**
     * Handle Parse Error
     * @param error Parse error
     *
     * @returns error
     */
    public handleParseError(e: Parse.Error): Error | Parse.Error {
        if (!e && !e.code) {
            e = {
                code: Parse.Error.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
            };
        }
        switch (e.code) {
            case Parse.Error.CONNECTION_FAILED:
                this.validTokenSubject.next(false);
                this.router.navigate(['/login']);
                return e;
            case Parse.Error.INTERNAL_SERVER_ERROR:
                return e;
            case Parse.Error.INVALID_SESSION_TOKEN:
                Parse.User.logOut();
                this.validTokenSubject.next(false);
                this.router.navigate(['/login']);
                return e;
            default:
                return e;
        }
    }
}
