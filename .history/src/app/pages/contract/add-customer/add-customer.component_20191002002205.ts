import { Component, OnInit } from '@angular/core';
import { AddGuideComponent } from '../../manage-guide/add-guide/add-guide.component';
import { NbDialogService } from '@nebular/theme';

@Component({
    selector: 'ngx-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  private dialogService: NbDialogService,

    public addresses: any[] = [
        {
            address: '',
            street: '',
            city: '',
            country: '',
        },
    ];
    constructor() {}

    ngOnInit() {}
    this.dialogService
    .open(AddGuideComponent, {
        context: {
            title: 'Create',
        },
    })
    .onClose.subscribe(async (data: { fullName: string; email: string; phone: any; address: string; birthday: any }) => {
        if (data) {
            try {
                let i = await this.guideService.addGuide(data.fullName, data.email, data.address, data.phone, data.birthday);
                await this.getGuides();
                this.toastrService.success(`Add Location Success`, 'Create success');
            } catch (ex) {
                this.toastrService.error(ex, `Create Error`);
            }
        }
    });
  }
    addAddress() {
        this.addresses.push({
            address: '',
            street: '',
            city: '',
            country: '',
        });
    }
    removeAddress(i: number) {
        this.addresses.splice(i, 1);
    }

    logValue() {
        console.log(this.addresses);
    }
}
