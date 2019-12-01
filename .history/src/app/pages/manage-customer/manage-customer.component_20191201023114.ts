import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as Parse from 'parse';
import * as moment from 'moment';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';

@Component({
    selector: 'ngx-manage-customer',
    templateUrl: './manage-customer.component.html',
    styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit {
    codeTour: String;
    startDay: any;
    endDay: any;
    member: string = '';
    dataSourses: Array<any> = [];
    settings = {
        actions: {
            add: false,
            delete: false,
            edit: false,
        },
        columns: {
            id: {
                title: 'Mã khách hàng',
                type: 'string',
                editable: true,
            },
            fullName: {
                title: 'Họ & tên',
                type: 'string',
                editable: true,
            },
            phone: {
                title: 'Phone',
                type: 'string',
                editable: true,
            },
            member: {
                type: 'string',
                editable: true,
            },
        },
    };
    source: LocalDataSource = new LocalDataSource();
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'mytable',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };

    constructor(private contractService: ContractService, private exportAsService: ExportAsService) {
        console.log('custom');
        this.getCustom();
    }

    ngOnInit() {}
    capital_letter(str) {
        str = str.split(' ');
        for (let i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
        return str.join(' ');
    }
    async getCustom() {
        this.dataSourses = [];
        const customer = Parse.Object.extend('customer');
        const query = new Parse.Query(customer);
        query.include('objUser');
        let result = await query.find();
        console.log(result);
        for (let res of result) {
            if (res.get('paid') >= 100000000) this.member = 'Khách hàng VIP';
            else {
                if (res.get('paid') >= 50000000) this.member = 'Khách hàng thân thiện';
                else this.member = 'Khách hàng thường';
            }

            this.dataSourses.push({
                id: res.id,
                fullName: this.capital_letter(res.get('objUser').get('fullname')),
                phone: res.get('objUser').get('phone'),
                member: this.member,
            });
            this.source.load(this.dataSourses);
        }
    }
    exportAs(type: SupportedExtensions, opt?: string) {
        this.config.type = type;
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }
        this.exportAsService.save(this.config, 'myFile').subscribe(() => {});
    }
}
