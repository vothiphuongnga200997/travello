import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    _albums = [];
    constructor(private _lightbox: Lightbox) {
        for (let i = 1; i <= 4; i++) {
            this._albums[i] = '../../../assets/img/blog-img/0 (3).jpg';
        }
    }

    ngOnInit() {}
    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._albums, index);
    }

    close(): void {
        // close lightbox programmatically
        this._lightbox.close();
    }
}
