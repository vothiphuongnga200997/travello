import { OnInit, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
declare let paypal: any;
import { HttpClient } from '@angular/common/http';
import * as Parse from 'parse';

@Component({
    selector: 'ngx-palpay',
    template: `
        <nb-card style="height: 300px; width: 400px">
            <nb-card-header> </nb-card-header>
            <nb-card-body>
                <div>Số tiền còn lại của bạn là: {{ this.number | number }}đ</div>
                <div id="paypal-checkout-btn"></div>
            </nb-card-body>
        </nb-card>
    `,
})
export class Paypal implements OnInit {
    title: String;
    number: number;
    paypalLoad: boolean;
    addScript: boolean;
    USD: number = 0;
    constructor(protected ref: NbDialogRef<Paypal>, private http: HttpClient) {}
    ngOnInit() {
        this.quydoi(this.number);
    }
    async quydoi(pay) {
        let result: any;
        let n = await this.http.get('https://openexchangerates.org/api/latest.json?app_id=35ecc69adc9e4459be28ae175fbc1750&base=USD');
        await n.subscribe(async res => {
            result = await res;
            let money = (pay / result.rates['VND']).toFixed(2);
            this.USD = Number(money);
        });
    }
    paypalConfig = {
        env: 'sandbox',
        client: {
            sandbox: 'AbZCEhate9NAGs9eIvLkcygXifG5XkIHUMGbOgExHUX2pvylJ9kPIU0tPFtwNRrwFhwH6VtCq7Tc0waT',
            production: '<your-production-key here>',
        },
        commit: true,
        payment: (data, actions) => {
            return actions.payment.create({
                payment: {
                    transactions: [{ amount: { total: this.USD, currency: 'USD' } }],
                },
            });
        },
        onAuthorize: (data, actions) => {
            return actions.payment.execute().then(payment => {
                let contract = Parse.Object.extend('contract');
                let Object = new contract();
                this.ref.close({
                    pennant: true,
                });
            });
        },
    };
    queryPaid() {}
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewChecked(): void {
        if (!this.addScript) {
            this.addPaypalScript().then(() => {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.paypalLoad = false;
            });
        }
    }

    addPaypalScript() {
        this.addScript = true;
        return new Promise((resolve, reject) => {
            let scripttagElement = document.createElement('script');
            scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
            scripttagElement.onload = resolve;
            document.body.appendChild(scripttagElement);
        });
    }
}
