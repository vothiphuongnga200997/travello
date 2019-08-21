import { Component, TemplateRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { DialogInterface } from '../../interface';

@Component({
    moduleId: module.id,
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
    @Input() config: DialogInterface;
    @ViewChild('dialog') dialog: TemplateRef<any>;
    @Output() leftBtnEventEmitter: EventEmitter<any> = new EventEmitter();
    @Output() rightBtnEventEmitter: EventEmitter<any> = new EventEmitter();

    constructor(private dialogService: NbDialogService) {}

    open() {
        this.dialogService.open(this.dialog, {
            context: this.config,
            autoFocus: false,
        });
    }

    onLeftBtnClick(ref: NbDialogRef<any>, data: any) {
        this.leftBtnEventEmitter.next(data);
        ref.close();
    }

    onRightBtnClick(ref: NbDialogRef<any>, data: any) {
        this.rightBtnEventEmitter.next(data);
        ref.close();
    }
}
