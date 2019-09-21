import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { AddGuideComponent } from './add-guide/add-guide.component';
import { ToastrService } from '../../shared/services';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { GuideService } from '../../shared/services/guide.service';
import * as moment from 'moment';
import { DialogInterface, ButtonStatusEnum } from '../../shared/interface';
import { DialogComponent } from '../../shared/modules/dialog/dialog.component';
import { TaskGuideComponent } from './task-guide/task-guide.component';
import { LoadingService } from '../../shared/services/loading.service';
@Component({
    moduleId: module.id,
    selector: 'button-view',
    template: `
        <div class="download">
            <a class="d-flex justify-content-center" (click)="onClick()"
                ><img style="height: 25px;width: 25px;" src="../../../assets/images/calendar.png"
            /></a>
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
    selector: 'ngx-manage-guide',
    templateUrl: './manage-guide.component.html',
    styleUrls: ['./manage-guide.component.scss'],
})
export class ManageGuideComponent implements OnInit {
    generalSource: SafeResourceUrl;

    robotSource: SafeResourceUrl;
    metricSource: SafeResourceUrl;
    statisticsSource: SafeResourceUrl;
    date: Date;

    settings = {
        // actions: {
        //      add: false,
        // },
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
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
            fullName: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            birthday: {
                title: 'Ngày sinh',
                type: 'datetime',
                editable: true,
            },
            address: {
                title: 'Địa chỉ',
                type: 'string',
                editable: true,
            },
            email: {
                title: 'Email',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'number',
                editable: true,
            },
            task: {
                title: 'Công việc',
                type: 'custom',
                renderComponent: ButtonViewComponent,
                onComponentInitFunction: instance => {
                    instance.save.subscribe(row => {
                        this.taskGuide(row.id);
                    });
                },
                filter: false,
            },
        },
    };
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };
    @ViewChild('confirmDeleteDialog', { static: true }) deleteDialog: DialogComponent;

    source: LocalDataSource = new LocalDataSource();
    constructor(
        private windowService: NbWindowService,
        private dialogService: NbDialogService,
        private toastrService: ToastrService,
        private guideService: GuideService,
        private loadingService: LoadingService,
    ) {
        this.getGuides();
    }

    ngOnInit() {}
    openWindowForm() {
        this.windowService.open(TaskGuideComponent, {
            context: {
                title: 'Edit',
                obj: 'hihi',
            },
        });
    }
    // async add() {
    //     this.dialogService
    //         .open(AddGuideComponent, {
    //             context: {
    //                 title: 'Create',
    //             },
    //         })
    //         .onClose.subscribe(async (data: { fullName: string; email: string; phone: any; address: string; birthday: any }) => {
    //             if (data) {
    //                 try {
    //                     console.log(data);
    //                     let i = await this.guideService.addGuide(data.fullName, data.email, data.address, data.phone, data.birthday);
    //                     await this.getGuides();
    //                     this.toastrService.success(`Add Location Success`, 'Create success');
    //                 } catch (ex) {
    //                     this.toastrService.error(ex, `Create Error`);
    //                 }
    //             }
    //         });
    // }
    formatDate(dateString: string) {
        let momentObj = moment(dateString);
        return momentObj.format('DD-MM-YYYY');
    }
    async getGuides() {
        let i = await this.guideService.getListGuides();
        if (i && i.length) {
            let dataSourses = i.map(res => {
                return {
                    id: res.id,
                    fullName: res.get('fullName'),
                    email: res.get('email'),
                    phone: res.get('phone'),
                    address: res.get('address'),
                    birthday: this.formatDate(res.get('birthday')),
                    date: res.get('birthday'),
                };
            });
            this.source.load(dataSourses);
        }
    }
    // edit(event) {
    //     console.log(this.date);
    //     this.dialogService
    //         .open(AddGuideComponent, {
    //             context: {
    //                 title: 'Edit',
    //                 obj: event.data,
    //             },
    //         })
    //         .onClose.subscribe(
    //             async (data: { id: string; fullName: string; email: string; phone: any; address: string; birthday: any }) => {
    //                 if (data) {
    //                     try {
    //                         console.log(data);
    //                         let i = await this.guideService.editGuide(
    //                             data.id,
    //                             data.fullName,
    //                             data.email,
    //                             data.address,
    //                             data.phone,
    //                             data.birthday,
    //                         );
    //                         await this.getGuides();
    //                         this.toastrService.success(`Update Guide Success`, 'Update success');
    //                     } catch (ex) {
    //                         this.toastrService.error(ex, `Update Error`);
    //                     }
    //                 }
    //             },
    //         );
    //     console.log(event.data.birthday);
    // }
    delete(event) {
        this.dialogConfig = {
            title: 'Delete Location',
            content: `Do you want to delete guide ${event.data.fullName}?`,
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
            let result = await this.guideService.delete(event.id);
            if (result) {
                this.toastrService.success(`Delete guide ${event.id} success`, `Delete guide`);
                this.getGuides();
            } else {
                this.toastrService.error(`Delete guide ${event.id} fail`, `Delete guide`);
            }
        } catch (error) {
            this.toastrService.error(error, `Delete guide`);
        }
    }
    taskGuide(id) {
        this.dialogService.open(TaskGuideComponent, {
            context: {
                title: 'Create',
            },
        });
    }
}
