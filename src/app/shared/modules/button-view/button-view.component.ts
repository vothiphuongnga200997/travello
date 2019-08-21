import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    moduleId: module.id,
    selector: 'button-view',
    templateUrl: './button-view.component.html',
    styleUrls: ['./button-view.component.scss'],
})
export class ButtonViewComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: any;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.value || this.value;
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}
