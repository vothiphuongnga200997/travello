import { Injectable } from '@angular/core';
import { Utils } from '../utils/index';

@Injectable()
export class ShareDataService {
    public data: { [key: string]: any };

    constructor() {
        this.data = {};
    }

    public setData(key: string, value: any) {
        if (key) {
            this.data[key] = value;
        }
    }

    public getData(key: string, clearData?: boolean) {
        if (!key) {
            return null;
        }
        if (clearData) {
            let data = Utils.cloneObject(this.data[key]);
            this.data[key] = undefined;
            return data;
        } else {
            return Utils.cloneObject(this.data[key]);
        }
    }
}
