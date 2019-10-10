import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-select-tour',
    templateUrl: './select-tour.component.html',
    styleUrls: ['./select-tour.component.scss'],
})
export class SelectTourComponent implements OnInit {
    constructor(private router: ActivatedRoute) {}
    id: any;
    validatingForm: FormGroup;

    ngOnInit() {
        this.id = this.router.snapshot.paramMap.get('id');
        console.log(this.id);
    }
}
