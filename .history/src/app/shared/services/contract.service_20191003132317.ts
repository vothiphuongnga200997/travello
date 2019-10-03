import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';

@Injectable()
export class GuideService {
    dataUpdate: Array<any> = [];

    constructor() {
        console.log('contract');
    }
}
