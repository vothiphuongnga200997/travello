import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    private _albums = [];
    constructor(private _lightbox: Lightbox) {
        for (let i = 1; i <= 4; i++) {
            const src = 'demo/img/image' + i + '.jpg';
            const caption = 'Image ' + i + ' caption here';
            const thumb = 'demo/img/image' + i + '-thumb.jpg';
            const album = {
                src: src,
                caption: caption,
                thumb: thumb,
            };
            this._albums.push(album);
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
