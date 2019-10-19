import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../shared/services';
import { TourService } from '../../shared/services/tour.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
@Component({
    selector: 'ngx-book-tour',
    templateUrl: './book-tour.component.html',
    styleUrls: ['./book-tour.component.scss'],
})
export class BookTourComponent implements OnInit {
    // thanh toan paypal
    public payPalConfig?: IPayPalConfig;
    showSuccess: boolean;
    idURL: string; // id tour tu URL
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    quantity: number = 0; // kiểm tra số lượng tạo form nhập thông tin
    totalMoney: number; // tong so tien
    infoTour: Array<any>;
    fullname: string; // ten nguoi dat
    submitted: boolean = false;
    payments: any; // hinh thuc thanh toan
    form1: boolean = true;
    form2: boolean = false;
    price: number; // so tien khach hang thanh toan
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
    ) {
        console.log('book');
    }

    ngOnInit() {
        this.fetchAndGetUser();
        this.idURL = this.route.snapshot.paramMap.get('id');
        this.getTour();
        this.firstForm = this.fb.group({
            adult: [null, Validators.compose([Validators.required, Validators.min(0)])],
            children: [''],
            sales: [''],
        });
        this.secondForm = this.fb.group({
            phone: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]+')])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            contacts: this.fb.array([]),
        });
        this.contactList = this.secondForm.get('contacts') as FormArray;

        this.thirdForm = this.fb.group({
            thirdCtrl: [''],
        });
        this.initConfig();
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
        }
    }
    i: number = 0;
    onFirstSubmit() {
        this.submitted = true;
        this.firstForm.markAsDirty();
        if (this.i === 0) {
            if (this.firstForm.value.children === '') this.firstForm.value.children = 0;
            this.quantity = this.firstForm.value.adult + this.firstForm.value.children;
            this.contactList = this.secondForm.get('contacts') as FormArray;

            for (let i = 0; i < this.quantity; i++) {
                this.contactList.push(this.createContact());
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
                let number: number = 0;
                if (this.firstForm.value.children === '') this.firstForm.value.children = 0;
                number = this.firstForm.value.adult + this.firstForm.value.children;
                // tao form
                for (let i = 0; i < number; i++) {
                    this.contactList.push(this.createContact());
                }
                this.quantity = this.firstForm.value.adult + this.firstForm.value.children;
            }
        }
        this.submitted = false;
    }

    onSecondSubmit() {
        this.submitted = true;
        this.secondForm.markAsDirty();
    }

    onThirdSubmit() {
        this.submitted = true;
        this.thirdForm.markAsDirty();
    }

    createContact(): FormGroup {
        try {
            return this.fb.group({
                name: [null, Validators.compose([Validators.required])],
                phonecustomer: [null],
                address: [null],
                gender: [null],
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
        console.log(this.infoTour);
    }

    pay() {
        this.totalMoney = 0;
        if (this.firstForm.value.adult !== '' || this.firstForm.value.children !== '') {
            this.totalMoney =
                this.infoTour[0].price * this.firstForm.value.adult + this.infoTour[0].childrenPrice * this.firstForm.value.children;
        }
        this.price = this.totalMoney;
    }
    paymentAmount(number) {
        this.price = 0;
        if (number === 1) {
            this.form1 = true;
            this.form2 = false;
            this.price = this.totalMoney;
        } else {
            this.form1 = false;
            this.form2 = true;
            this.price = this.totalMoney / 2;
        }
    }

    // thanh toan paypal

    private initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrderOnClient: data =>
                <ICreateOrderRequest>{
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'EUR',
                                value: '9.99',
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: '9.99',
                                    },
                                },
                            },
                            items: [
                                {
                                    name: 'Enterprise Subscription',
                                    quantity: '1',
                                    category: 'DIGITAL_GOODS',
                                    unit_amount: {
                                        currency_code: 'EUR',
                                        value: '9.99',
                                    },
                                },
                            ],
                        },
                    ],
                },
            advanced: {
                commit: 'true',
            },
            style: {
                label: 'paypal',
                layout: 'vertical',
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then(details => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });
            },
            onClientAuthorization: data => {
                console.log(
                    'onClientAuthorization - you should probably inform your server about completed transaction at this point',
                    data,
                );
                this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: err => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }
}
