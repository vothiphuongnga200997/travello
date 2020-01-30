import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from '../../shared/services';
import { AddLocationComponent } from './add-location/add-location.component';
import { LocationService } from '../../shared/services/location.service';

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
        console.log('diadiem');
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
                    // console.log(data);
                    this.getListLocations();
                    // await this.locationService.addLocation(data.location, data.area);
                    // await this.getListLibrary();
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
                console.log(res);

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
                        console.log(data);
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
        if (event.data.isDefault) {
            this.toastrService.error(`Please choose another default version before delete current version.`, `Error`);
        } else {
            this.dialogConfig = {
                title: 'Delete Library Dependencies',
                content: 'Are you want to delete ?',
                data: event.data,
                rightBtnLabel: 'OK',
                leftBtnLabel: 'Cancel',
                rightBtnStatus: ButtonStatusEnum.Info,
                leftBtnStatus: ButtonStatusEnum.Hint,
            };
            this.deleteDialog.open();
        }
    }
}