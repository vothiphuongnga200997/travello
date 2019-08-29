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
        mode: 'external',
        columns: {
            id: {
                title: 'ID',
                type: 'string',
                editable: false,
            },
            file: {
                title: 'File',
                type: 'string',
                editable: true,
            },

            platform: {
                title: 'Platform',
                type: 'string',
                editable: true,
            },
            version: {
                title: 'Version',
                type: 'string',
                editable: true,
            },
            date: {
                title: 'CreatedAt',
                type: 'string',
                editable: true,
            },
            isDefault: {
                title: 'Default',
                type: 'string',
                editable: true,
            },

            url: {
                title: 'Download',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {
                        // this.download(row);
                    });
                },
                filter: false,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService) {}

    ngOnInit() {}
    createMetric(data) {
        this.dialogService.open(AddDiaDiemComponent, {
            context: {
                title: 'Add new tour',
            },
        });
        // tslint:disable-next-line:no-shadowed-variable
        // .onClose.subscribe((data: { file: any; version: string; platform: string; isDefault: boolean }) => {
        //     try {
        //         if (data && data.file && data.platform) {
        //         }
        //     } catch (ex) {
        //         this.toastrService.error(ex, 'Create error');
        //     }
        // });
    }
}
