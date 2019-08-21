import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-qly-nhan-vien',
    templateUrl: './qly-nhan-vien.component.html',
    styleUrls: ['./qly-nhan-vien.component.scss'],
})
export class QlyNhanVienComponent implements OnInit {
    obj: Array<any>;
    i: number = 5;

    constructor() {}

    ngOnInit() {}
    add(event) {
        console.log(event);
    }
}
