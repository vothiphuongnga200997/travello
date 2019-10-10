import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
})
export class BookTourComponent implements OnInit {
    images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

    constructor(private fb: FormBuilder) {}

    ngOnInit() {}
}
