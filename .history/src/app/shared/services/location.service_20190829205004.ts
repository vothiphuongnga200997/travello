import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import * as Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class LocationService {
    dataUpdate: Array<any> = [];

    constructor(public parseService: ParseService, private http: HttpClient) {}
}
