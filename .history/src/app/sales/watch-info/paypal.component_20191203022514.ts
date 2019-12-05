import { OnInit } from '@angular/core';
declare let paypal: any;
@Component({
    selector: 'ngx-contract',
    template: `
        <nb-card>
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
    constructor(protected ref: NbDialogRef<Paypal>) {}
    ngOnInit() {}
}
