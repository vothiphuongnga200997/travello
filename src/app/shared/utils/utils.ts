import * as _ from 'lodash';

export class Utils {
    public static mergeObject(defaultObj: any, specObject: any) {
        if (typeof specObject !== 'object') {
            return defaultObj;
        }
        if (typeof defaultObj !== 'object') {
            return specObject;
        }
        for (let prop in specObject) {
            if (typeof specObject[prop] === 'object' && defaultObj[prop]) {
                defaultObj[prop] = Utils.mergeObject(defaultObj[prop], specObject[prop]);
            } else {
                defaultObj[prop] = specObject[prop];
            }
        }
        return defaultObj;
    }

    public static cloneObject(obj: any) {
        let copy: { [key: string]: any };

        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' !== typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = Utils.cloneObject(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = Utils.cloneObject(obj[attr]);
                }
            }
            return copy;
        }

        throw new Error(`Unable to copy obj! Its type isn't supported.`);
    }

    public static formatFileSize(byteCount: number): string {
        let n = _.clone(byteCount);
        for (let unit of ['b', 'kb', 'mb']) {
            if (n >= 1024) {
                n /= 1024.0;
            } else {
                return n.toFixed(2) + unit;
            }
        }
        return n.toFixed(2) + 'mb';
    }

    public static formatFileName(fileName: string, formatName: string): string {
        return `${formatName}.${Utils.getFileExtension(fileName)}`;
    }

    public static getFileExtension(fileName: string) {
        let arr = fileName.split('.');
        return arr.length > 1 ? arr[arr.length - 1] : '';
    }

    public static getDomain(url, subdomain) {
        subdomain = subdomain || false;

        url = url.replace(/(https?:\/\/)?(www.)?/i, '');

        if (!subdomain) {
            url = url.split('.');

            url = url.slice(url.length - 2).join('.');
        }

        if (url.indexOf('/') !== -1) {
            url = url.split('/')[0];
        }

        url = url.replace(/(\:\d+)$/, '');

        return url;
    }
}
