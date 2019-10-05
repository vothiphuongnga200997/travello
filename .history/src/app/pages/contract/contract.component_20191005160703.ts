import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DeleteComponent } from './delete-customer';
import * as moment from 'moment';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
    searchText;
    contract: Array<any> = [];
    @ViewChild('find', { static: true }) accordion;
    toggle() {
        this.accordion.toggle();
    }
    name: String;
    codeTour: String;
    nameTour: String;
    stratDay: String;
    endDay: String;
    constructor(private toastrService: ToastrService, private dialogService: NbDialogService, private contractService: ContractService) {
        console.log('dgdg');
        this.getContract();
    }

    ngOnInit() {}

    async addCustom() {
        try {
            this.dialogService
                .open(AddCustomerComponent, {
                    context: {
                        title: 'Create',
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        try {
                            let result = await this.contractService.addContract(data);
                            if (result) {
                                await this.getContract();
                                this.toastrService.success(`Add Success`, 'Add success');
                            }
                        } catch (ex) {
                            this.toastrService.error(ex, `Add Error`);
                        }
                    }
                });
        } catch (ex) {
            this.toastrService.error(ex, `Add Error`);
        }
    }
    async getContract() {
        let result = await this.contractService.getContrat();
        this.contract = [];
        if (result) {
            result.map(data => {
                this.contract.push({
                    id: data.id,
                    representative: data.get('objUser').get('fullname'),
                    tour: data.get('objTour').get('code'),
                    idTour: data.get('objTour').id,
                    nameTour: data.get('objTour').get('nameTour'),
                    startDay: moment(data.get('objTour').get('startDay')).format('DD/MM/YYYY'),
                    endDay: moment(data.get('objTour').get('endDay')).format('DD/MM/YYYY'),
                    tourist: data.get('infoCustom'),
                    price: data.get('price'),
                    quantity: data.get('infoCustom').length,
                });
            });
        }
    }
    delete(event) {
        console.log(event);

        this.dialogService
            .open(DeleteComponent, {
                context: {
                    title: 'Delete',
                    id: event,
                },
            })
            .onClose.subscribe(async data => {
                try {
                    if (data) {
                        await this.getContract();
                        this.toastrService.success(`Delete Success`, 'Delete success');
                    }
                } catch (ex) {
                    this.toastrService.error(ex, `Update Error`);
                }
            });
    }
    async filter() {
        let contract = Parse.Object.extend('contract');
        let query = new Parse.Query(contract);

        let user = Parse.Object.extend('User');
        let innerQuery = new Parse.Query(user);

        let tour = Parse.Object.extend('tour');
        let innerQueryTour = new Parse.Query(tour);

        if (this.name !== null && this.name !== undefined && this.name !== '') {
            innerQuery.fullText('fullname', this.name);
            query.matchesQuery('objUser', innerQuery);
        }
        if (this.codeTour !== null && this.codeTour !== undefined && this.codeTour !== '') {
            innerQueryTour.equalTo('code', this.codeTour);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.nameTour !== null && this.nameTour !== undefined && this.nameTour !== '') {
            innerQueryTour.fullText('nameTour', this.nameTour);
            query.matchesQuery('objTour', innerQueryTour);
        }
        let resutl = await query.find();
        console.log(resutl);
    }
}
