import { Component, OnInit } from '@angular/core';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    albums = [];
    constructor(private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
        _lightboxConfig.enableTransition = true;
        _lightboxConfig.wrapAround = true;
        _lightboxConfig.showImageNumberLabel = true;
        for (let i = 1; i <= 4; i++) {
            const src = '../../../assets/img/blog-img/0 (3).jpg';
            const caption = 'Image ' + i + ' caption here';
            const thumb = '../../../assets/img/blog-img/0 (3).jpg';
            const album = {
                src: src,
                caption: caption,
                thumb: thumb,
            };

            this.albums.push(album);
        }
    }

    ngOnInit() {}
    open(index: number): void {
        // open lightbox
        this._lightbox.open(this.albums, index);
    }

    close(): void {
        // close lightbox programmatically
        this._lightbox.close();
    }
}
