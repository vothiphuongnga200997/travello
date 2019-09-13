import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class LoadingService {
    public loadingSubject: Subject<boolean>;
    private startAt: any;
    constructor() {
        this.loadingSubject = new BehaviorSubject(false);
    }

    public start() {
        this.startAt = moment();
        this.loadingSubject.next(true);
    }

    public stop() {
        let diff = moment().diff(this.startAt, 'ms');
        diff = diff < 2000 ? 0 : 0;
        setTimeout(() => {
            this.loadingSubject.next(false);
        }, diff);
        console.log(this.loadingSubject);
    }
}
