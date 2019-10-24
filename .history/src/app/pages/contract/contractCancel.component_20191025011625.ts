import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../shared/services/contract.service';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './contractCancel.component.html',
    styleUrls: ['./contract.component.scss'],
})
export class ContractCancelComponent implements OnInit {
    contract: Array<any>;
    constructor(private contractService: ContractService) {
        this.getContract();
    }

    ngOnInit() {}
    async getContract() {
        let result = await this.contractService.getContratCancel();
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
                    quantity: data.get('numberKids') + data.get('numberAdult'),
                    numberKids: data.get('numberKids'),
                    numberAdult: data.get('numberAdult'),
                    phone: data.get('objUser').get('phone'),
                    tourQuantity: data.get('objTour').get('quantity'),
                    idUser: data.get('objUser').id,
                });
            });
        }
    }
}
