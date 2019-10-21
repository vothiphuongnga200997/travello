import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ContractService } from '../../shared/services/contract.service';
import { ToastrService } from '../../shared/services';
import { DeleteComponent } from './delete-customer';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { LoadingService } from '../../shared/services/loading.service';
import { EditContractComponent } from './add-customer/edit-contract.component';
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
    startDay: any;
    endDay: any;
    phone: any;
    idCustom: String;
    config: ExportAsConfig = {
        type: 'pdf',
        elementId: 'mytable',
        options: {
            jsPDF: {
                orientation: 'landscape',
            },
        },
    };
    constructor(
        private exportAsService: ExportAsService,
        private toastrService: ToastrService,
        private dialogService: NbDialogService,
        private contractService: ContractService,
        private loadingService: LoadingService,
    ) {
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
                            this.loadingService.start();
                            let result = await this.contractService.addContract(data);
                            this.loadingService.stop();
                            if (result) {
                                await this.getContract();
                                this.toastrService.success(`Add Success`, 'Add success');
                            }
                        } catch (ex) {
                            this.loadingService.stop();
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
                    phone: data.get('objUser').get('phone'),
                    tourQuantity: data.get('objTour').get('quantity'),
                    idUser: data.get('objUser').id,
                });
            });
        }
    }
    delete(event, idTour, quantity) {
        this.dialogService
            .open(DeleteComponent, {
                context: {
                    title: 'Delete',
                    id: event,
                    idTour: idTour,
                    quantity: quantity,
                },
            })
            .onClose.subscribe(async data => {
                try {
                    if (data) {
                        await this.getContract();
                        this.toastrService.success(`Delete Success`, 'Delete success');
                    }
                } catch (ex) {
                    this.toastrService.error(ex, `Delete Error`);
                }
            });
    }
    deleteArray: Array<any>;
    deleteTicket(idUser, idTour, name, phone, number) {
        this.deleteArray = this.contract[0].tourist;
        this.deleteArray.splice(number, 1);
        console.log(this.deleteArray);
        console.log(idUser);
        console.log(idTour);
        console.log(name);
        console.log(phone);
        console.log(number);
    }

    edit(event) {
        console.log(event);
        try {
            this.dialogService
                .open(EditContractComponent, {
                    context: {
                        title: 'Create',
                        idEdit: event,
                    },
                })
                .onClose.subscribe(async data => {
                    if (data) {
                        try {
                            await this.contractService.editContract(data);
                            this.getContract();
                            this.toastrService.success(`Update Success`, 'Update success');
                        } catch (ex) {
                            this.toastrService.error(ex, `Update Error`);
                        }
                    }
                });
        } catch (ex) {
            this.toastrService.error(ex, `Add Error`);
        }
    }
    async filter() {
        this.contract = [];
        this.loadingService.start();
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
        if (this.phone !== null && this.phone !== undefined && this.phone !== '') {
            innerQuery.equalTo('phone', parseFloat(this.phone.toString()));
            query.matchesQuery('objUser', innerQuery);
        }
        if (this.codeTour !== null && this.codeTour !== undefined && this.codeTour !== '') {
            innerQueryTour.equalTo('code', this.codeTour);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.startDay !== null && this.startDay !== undefined && this.startDay !== '') {
            innerQueryTour.greaterThan('startDay', this.startDay);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.endDay !== null && this.endDay !== undefined && this.endDay !== '') {
            innerQueryTour.lessThan('endDay', this.endDay);
            query.matchesQuery('objTour', innerQueryTour);
        }
        if (this.idCustom !== null && this.idCustom !== undefined && this.idCustom !== '') {
            query.equanTo('objectId', this.idCustom);
        }
        let result = await query.find();
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
        this.loadingService.stop();
    }
    exportAs(type: SupportedExtensions, opt?: string) {
        this.config.type = type;
        if (opt) {
            this.config.options.jsPDF.orientation = opt;
        }
        this.exportAsService.save(this.config, 'myFile').subscribe(() => {
            // save started
        });
        // this.exportAsService.get(this.config).subscribe(content => {
        //   console.log(content);
        // });
    }
    async checkQuantity(idTour) {}
}
