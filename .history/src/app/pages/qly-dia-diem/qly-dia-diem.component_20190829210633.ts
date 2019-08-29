import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from '../../shared/services';
import { AddDiaDiemComponent } from './add-dia-diem/add-dia-diem.component';
import { LocationService } from '../../shared/services/location.service';
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
            location: {
                title: 'Địa Điểm',
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
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService, private locationService: LocationService) {}

    ngOnInit() {}
    async add() {
        this.dialogService
            .open(AddDiaDiemComponent, {
                context: {
                    title: 'Create',
                },
            })
            .onClose.subscribe(async (data: { location: string; area: string }) => {
                try {
                    console.log(data);
                    // await this.locationService.addLocation()
                    // await this.getListLibrary();
                    this.toastrService.success(`Add Library Dependencies Success`, 'Create success');
                } catch (ex) {
                    this.toastrService.error(ex, `Create Error`);
                }
            });
    }
}
