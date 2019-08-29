import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from '../../shared/services';
import { AddDiaDiemComponent } from './add-dia-diem/add-dia-diem.component';
@Component({
    moduleId: module.id,
    selector: 'button-view',
    template: `
        <div class="download">
            <a class="d-flex justify-content-center" (click)="onClick()"><i class="fas fa-download"></i></a>
        </div>
    `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.renderValue = this.value.toString().toUpperCase();
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}
@Component({
    selector: 'ngx-qly-dia-diem',
    templateUrl: './qly-dia-diem.component.html',
    styleUrls: ['./qly-dia-diem.component.scss'],
})
export class QlyDiaDiemComponent implements OnInit {
    generalSource: SafeResourceUrl;

    robotSource: SafeResourceUrl;
    metricSource: SafeResourceUrl;
    statisticsSource: SafeResourceUrl;
    settings = {
        // actions: {
        //      add: false,
        // },
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            // createButtonContent: '<i class="nb-checkmark"></i>',
            // cancelButtonContent: '<i class="nb-close"></i>',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        columns: {
            id: {
                title: 'ID',
                type: 'string',
                editable: false,
            },
            location: {
                title: 'Địa điểm',
                type: 'string',
                editable: true,
            },
            area: {
                title: 'Khu vực',
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    dialogConfig: { title: string; content: string; data: any; rightBtnLabel: string; leftBtnLabel: string };
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService) {}

    ngOnInit() {}
    createMetric(data) {
        this.dialogConfig = {
            title: 'Delete Technical Metric ',
            content: `Are you want to delete ?`,
            // data: event.data,
            rightBtnLabel: 'OK',
            leftBtnLabel: 'Cancel',
            // rightBtnStatus: ButtonStatusEnum.Info,
            // leftBtnStatus: ButtonStatusEnum.Hint,
        };
        // this.deleteDialog.open();
    }
}
