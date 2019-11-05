import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { TourService } from '../../shared/services/tour.service';
@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './contractCancel.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractCancelComponent implements OnInit {
    contract: Array<any>;
    settings = {
        actions: {
            add: false,
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
                title: 'Mã giao dịch',
                type: 'string',
                editable: true,
            },
            fullname: {
                title: 'Họ & tên',
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
            quantity: {
                title: 'Số lượng',
                type: 'number',
                editable: true,
            },
            tour: {
                title: 'Tour',
                type: 'string',
                editable: true,
            },
            pay: {
                title: 'Thanh toán',
                type: 'string',
                editable: true,
            },
            createAt: {
                title: 'Ngày đặt',
                type: 'string',
                editable: true,
            },
            // status: {
            //     title: 'Trạng thái',
            //     type: 'custom',
            //     renderComponent: StatusTextComponent,
            // },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    constructor(private contractService: ContractService, private tourService: TourService) {
        this.getContract();
    }

    ngOnInit() {}
    async getContract() {
        let result = await this.contractService.getContratCancel();
        this.contract = [];
        for (let data of result) {
            let schedule = await this.tourService.querySchedule(data.get('objSchedule').id);
            this.contract.push({
                id: data.id,
                representative: data.get('objUser').get('fullname'),
                tour: schedule.get('objTour').get('code'),
                idTour: schedule.id,
                nameTour: schedule.get('objTour').get('nameTour'),
                startDay: moment(schedule.get('startDay')).format('DD/MM/YYYY'),
                endDay: moment(schedule.get('endDay')).format('DD/MM/YYYY'),
                tourist: data.get('infoCustom'),
                price: data.get('price'),
                quantity: data.get('cancelContract').length,
                phone: data.get('objUser').get('phone'),
                tourQuantity: schedule.get('objTour').get('quantity'),
                idUser: data.get('objUser').id,
            });
        }
        this.source.load(this.contract);
    }
}
