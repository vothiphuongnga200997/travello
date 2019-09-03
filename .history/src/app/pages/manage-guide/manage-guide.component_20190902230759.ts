import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { AddGuideComponent } from './add-guide/add-guide.component';
import { ToastrService } from '../../shared/services';
import { NbDialogService } from '@nebular/theme';
import { GuideService } from '../../shared/services/guide.service';
import * as moment from 'moment';

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
                        console.log('detail');
                    });
                },
                filter: false,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor(private dialogService: NbDialogService, private toastrService: ToastrService, private guideService: GuideService) {
        this.getGuides();
    }

    ngOnInit() {}
    async add() {
        this.dialogService
            .open(AddGuideComponent, {
                context: {
                    title: 'Create',
                },
            })
            .onClose.subscribe(async (data: { fullName: string; email: string; phone: any; address: string; birthday: any }) => {
                if (data) {
                    try {
                        console.log(data);
                        let i = await this.guideService.addGuide(data.fullName, data.email, data.address, data.phone, data.birthday);
                        await this.getGuides();
                        this.toastrService.success(`Add Location Success`, 'Create success');
                    } catch (ex) {
                        this.toastrService.error(ex, `Create Error`);
                    }
                }
            });
    }
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
    edit(event) {
        console.log(this.date);
        this.dialogService
            .open(AddGuideComponent, {
                context: {
                    title: 'Edit',
                    obj: event.data,
                    birthday: this.date,
                },
            })
            .onClose.subscribe(async (data: { fullName: string; email: string; phone: any; address: string; birthday: any }) => {
                if (data) {
                    try {
                        console.log(data);
                        let i = await this.guideService.addGuide(data.fullName, data.email, data.address, data.phone, data.birthday);
                        await this.guideService.getListGuides();
                        console.log(i);
                        this.toastrService.success(`Add Location Success`, 'Create success');
                    } catch (ex) {
                        this.toastrService.error(ex, `Create Error`);
                    }
                }
            });
        console.log(event.data.birthday);
    }
}
