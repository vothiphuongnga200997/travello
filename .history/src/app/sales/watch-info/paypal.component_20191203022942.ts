import { OnInit, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
declare let paypal: any;
@Component({
    selector: 'ngx-palpay',
    template: `
        <nb-card style="height: 100px; width: 250px">
            <nb-card-header> </nb-card-header>
            <nb-card-body>
                <div>Bạn muốn xóa hợp đồng {{ this.number }}</div>
            </nb-card-body>
        </nb-card>
    `,
})
export class Paypal implements OnInit {
    title: String;
    number: number;
    paypalLoad: boolean;
    addScript: boolean;
    constructor(protected ref: NbDialogRef<Paypal>) {}
    ngOnInit() {}
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
                    transactions: [{ amount: { total: 22222, currency: 'USD' } }],
                },
            });
        },
        onAuthorize: (data, actions) => {
            return actions.payment.execute().then(payment => {});
        },
    };

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
