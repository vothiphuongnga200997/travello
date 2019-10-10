import { Component, OnInit } from '@angular/core';
import { IImage } from 'ng-simple-slideshow/src/app/modules/slideshow/IImage';

@Component({
    selector: 'ngx-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        // setTimeout(() => {
        //     console.log('adding an image url dynamically.');
        //     this.imageUrls.push('https://cdn-images-1.medium.com/max/2000/1*Nccd2ofdArlXF7v58UK94Q.jpeg');
        // }, 2000);
    }
}
