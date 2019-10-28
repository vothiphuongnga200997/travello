import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../shared/services';
import { TourService } from '../../shared/services/tour.service';
import { ContractService } from '../../shared/services/contract.service';
declare let paypal: any;
@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
})
export class BookTourComponent implements OnInit, AfterViewChecked {
    // thanh toan paypal
    addScript: boolean = false;
    paypalLoad: boolean = true;
    finalAmount: number = 1;
    // thanh toan paypal
    idURL: string; // id tour tu URL
    email: string; // email user;
    phone: string; // phone user;
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    fourForm: FormGroup;
    quantity: number = 0; // kiểm tra số lượng tạo form nhập thông tin
    totalMoney: number; // tong so tien
    infoTour: Array<any>;
    fullname: string; // ten nguoi dat
    submitted: boolean = false;
    payments: any; // hinh thuc thanh toan
    form1: boolean = true;
    form2: boolean = false;
    deposit: number; // so tien khach hang thanh toan
    transaction: boolean = true;
    success: boolean = false;
    finish: string; // send mail thanh cong
    public contactList: FormArray;
    get contactFormGroup() {
        return this.secondForm.get('contacts') as FormArray;
    }
    pauseOnHover = false;
    public href: string = '';
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private tourService: TourService,
        private contractService: ContractService,
    ) {
        console.log('book');
    }

    ngOnInit() {
        this.fetchAndGetUser();
        this.idURL = this.route.snapshot.paramMap.get('id');
        this.getTour();
        this.firstForm = this.fb.group({
            adult: [null, Validators.compose([Validators.required, Validators.min(1)])],
            children: [0, Validators.compose([Validators.required, Validators.min(0)])],
            promotion: [''],
            idTour: [this.idURL],
        });
        this.secondForm = this.fb.group({
            phone: [this.phone, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            email: [this.email, Validators.compose([Validators.required, Validators.email])],
            contacts: this.fb.array([]),
        });
        this.contactList = this.secondForm.get('contacts') as FormArray;

        this.thirdForm = this.fb.group({
            thirdCtrl: [null, Validators.required],
            confirmation: [null, Validators.required],
        });
    }
    getContactsFormGroup(index): FormGroup {
        const secondForm = this.contactList.controls[index] as FormGroup;
        return secondForm;
    }
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.router.navigate(['home']);
        } else {
            this.fullname = currentUser.get('fullname');
            this.email = currentUser.get('email');
            this.phone = currentUser.get('phone');
        }
    }
    i: number = 0;
    async onFirstSubmit() {
        this.submitted = true;
        this.firstForm.markAsDirty();
        if (this.i === 0) {
            if (this.firstForm.value.children === '') this.firstForm.value.children = 0;
            this.quantity = this.firstForm.value.adult + this.firstForm.value.children;
            this.contactList = this.secondForm.get('contacts') as FormArray;

            for (let i = 0; i < this.firstForm.value.adult; i++) {
                await this.contactList.push(this.createContactAdult());
            }
            for (let i = 0; i < this.firstForm.value.children; i++) {
                await this.contactList.push(this.createContactKids());
            }
            this.i++;
        } else {
            if (this.firstForm.value.children === '') this.firstForm.value.children = 0;
            if (this.quantity === this.firstForm.value.adult + this.firstForm.value.children) return;
            else {
                this.secondForm = this.fb.group({
                    phone: [this.secondForm.value.phone, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
                    email: [this.secondForm.value.email, Validators.compose([Validators.required, Validators.email])],
                    contacts: this.fb.array([]),
                });
                this.contactList = this.secondForm.get('contacts') as FormArray;
                if (this.firstForm.value.children === '') this.firstForm.value.children = 0;
                // tao form
                for (let i = 0; i < this.firstForm.value.adult; i++) {
                    await this.contactList.push(this.createContactAdult());
                }
                for (let i = 0; i < this.firstForm.value.children; i++) {
                    await this.contactList.push(this.createContactKids());
                }
                this.quantity = this.firstForm.value.adult + this.firstForm.value.children;
            }
        }
        this.submitted = false;
    }

    async onSecondSubmit() {
        this.submitted = true;
        let result = await this.contractService.setEmail(this.secondForm.value.email);
        console.log(result);
        this.secondForm.markAsDirty();
    }

    async onThirdSubmit() {
        this.submitted = true;
        if (!this.thirdForm.value.thirdCtrl && this.thirdForm.invalid) {
            return;
        } else {
            if (this.thirdForm.value.confirmation === this.infoTour[0].id) {
                let result = await this.contractService.booktour(
                    this.firstForm.value,
                    this.secondForm.value,
                    this.totalMoney,
                    this.deposit,
                    this.infoTour[0].empty,
                );
                if (!result) return;
                else {
                    this.transaction = false;
                    this.success = true;
                }
                this.thirdForm.markAsDirty();
            } else {
                this.finish = 'Mã xác nhận của bạn không đúng vui lòng kiểm tra lại';
            }
        }
    }

    createContactAdult(): FormGroup {
        try {
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null],
                address: [null],
                gender: [null],
                type: ['Người lớn'],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    createContactKids(): FormGroup {
        try {
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null],
                address: [null],
                gender: [null],
                type: ['Trẻ em'],
            });
        } catch (ex) {
            console.log(ex);
        }
    }
    async getTour() {
        this.infoTour = [];
        let result = await this.tourService.queryTour(this.idURL);
        if (result) {
            this.infoTour.push({
                id: result.id,
                name: result.attributes.nameTour,
                code: result.attributes.code,
                adultPrice: result.attributes.adultPrice,
                childrenPrice: result.attributes.childrenPrice,
                empty: result.attributes.empty,
                saleoff: result.attributes.saleoff,
                duration: result.attributes.duration,
                startDay: moment(result.attributes.startDay).format('DD/MM/YYYY'),
                endDay: moment(result.attributes.endDay).format('DD/MM/YYYY'),
                price: result.attributes.adultPrice - result.attributes.saleoff,
            });
        }
    }

    pay() {
        this.totalMoney = 0;
        if (this.firstForm.value.adult !== '' || this.firstForm.value.children !== '') {
            this.totalMoney =
                this.infoTour[0].price * this.firstForm.value.adult + this.infoTour[0].childrenPrice * this.firstForm.value.children;
        }
        this.deposit = this.totalMoney;
    }
    paymentAmount(number) {
        this.deposit = 0;
        if (number === 1) {
            this.form1 = true;
            this.form2 = false;
            this.deposit = this.totalMoney;
        } else {
            this.form1 = false;
            this.form2 = true;
            this.deposit = this.totalMoney / 2;
        }
    }
    // thanh toan paypal
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
    async sendMail() {
        let dataSendMail = {
            to: this.secondForm.value.email,
            content: `Xin chào ${this.fullname}! ` + `Mã xác nhận của bạn ${this.infoTour[0].id}`,
        };
        let i = await this.contractService.sendMail(dataSendMail);
        i.subscribe(async res => {
            // nhận data từ server ver62 cái id nó là res
            console.log('res', res);
            this.finish = 'Bạn vui lòng kiểm tra mail nhận mã xác nhận!';
        });
        console.log(i);
    }
}
