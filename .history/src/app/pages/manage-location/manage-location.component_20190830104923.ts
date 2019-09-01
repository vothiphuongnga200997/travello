import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from '../../shared/services';
import { AddLocationComponent } from './add-location/add-location.component';
import { LocationService } from '../../shared/services/location.service';
import { DialogInterface, ButtonStatusEnum } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';

@Component({
    selector: 'ngx-manage-location',
    templateUrl: './manage-location.component.html',
    styleUrls: ['./manage-location.component.scss'],
})
export class ManageLocationComponent implements OnInit {
    generalSource: SafeResourceUrl;

    robotSource: SafeResourceUrl;
    metricSource: SafeResourceUrl;
    statisticsSource: SafeResourceUrl;

    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    @ViewChild('confirmDeleteDialog') deleteDialog: DialogComponent;

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
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService, private locationService: LocationService) {
        this.getListLocations();
    }

    ngOnInit() {}
    async add() {
        this.dialogService
            .open(AddLocationComponent, {
                context: {
                    title: 'Create',
                },
            })
            .onClose.subscribe(async (data: { location: string; area: string }) => {
                try {
                    this.getListLocations();
                    await this.locationService.addLocation(data.location, data.area);
                    await this.getListLocations();
                    this.toastrService.success(`Add Library Dependencies Success`, 'Create success');
                } catch (ex) {
                    this.toastrService.error(ex, `Create Error`);
                }
            });
    }
    async getListLocations() {
        let i = await this.locationService.getListLocations();
        if (i && i.length) {
            let dataSources = i.map(res => {
                return {
                    id: res.id,
                    location: res.get('location'),
                    area: res.get('area'),
                };
            });
            this.source.load(dataSources);
        }
    }
    edit(event) {
        this.dialogService
            .open(AddLocationComponent, {
                context: {
                    title: 'Edit',
                    obj: event.data,
                },
            })
            .onClose.subscribe(async (data: { id: string; location: string; area: string }) => {
                try {
                    if (data) {
                        await this.locationService.edit(data.id, data.location, data.area);
                        this.toastrService.success(`Update Library Dependencies Success`, 'Update success');
                        await this.getListLocations();
                    }
                } catch (ex) {
                    this.toastrService.error(ex, `Update Error`);
                }
            });
    }
    delete(event) {
        console.log(event);
        this.dialogConfig = {
            title: 'Delete Library Dependencies',
            content: `Do you want to delete location ${event.data.location}?`,
            data: event.data,
            rightBtnLabel: 'OK',
            leftBtnLabel: 'Cancel',
            rightBtnStatus: ButtonStatusEnum.Info,
            leftBtnStatus: ButtonStatusEnum.Hint,
        };
        this.deleteDialog.open();
    }
    async onDelete(event) {
        try {
            let result = await this.locationService.delete(event.id);
            if (result) {
                this.toastrService.success(`Delete Libary ${event.id} success`, `Delete Libary`);
                this.getListLocations();
            } else {
                this.toastrService.error(`Delete Libary ${event.id} fail`, `Delete Libary`);
            }
        } catch (error) {
            this.toastrService.error(error, `Delete Libary`);
        }
    }
}
