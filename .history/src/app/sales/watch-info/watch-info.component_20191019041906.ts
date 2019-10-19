import { Component, OnInit, AfterViewChecked } from '@angular/core';
declare let paypal: any;

@Component({
    selector: 'ngx-watch-info',
    templateUrl: './watch-info.component.html',
    styleUrls: ['./watch-info.component.scss'],
})
export class WatchInfoComponent implements OnInit, AfterViewChecked {
    addScript: boolean = false;
    paypalLoad: boolean = true;
    finalAmount: number = 1;

    paypalConfig = {
        env: 'sandbox',
        client: {
            sandbox: '<your-sandbox-key-here>',
            production: '<your-production-key here>',
        },
        commit: true,
        payment: (data, actions) => {
            return actions.payment.create({
                payment: {
                    transactions: [{ amount: { total: this.finalAmount, currency: 'INR' } }],
                },
            });
        },
        onAuthorize: (data, actions) => {
            return actions.payment.execute().then(payment => {});
        },
    };
    ngOnInit(): void {}
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
