import { Component, ChangeDetectorRef } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { ShareDataService } from '../shared/services/share-data.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'ngx-pages',
    styleUrls: ['pages.component.scss'],
    templateUrl: './pages.component.html',
})
export class PagesComponent {
    public status: number;
    public code: string = ``;
    public currentWorkFlow: any = {};
    public isExistMetricList = false;

    listFiles: Array<any> = [];

    menu: NbMenuItem[] = [
        {
            title: 'Hướng dẫn viên',
            icon: 'person-add-outline',
            link: '/pages/qlnv',
        },
        {
            title: 'Tour',
            icon: 'paper-plane-outline',
            children: [
                {
                    title: 'Danh sách tour',
                    link: '/pages/tour',
                },
                {
                    title: 'Địa điểm',
                    link: '/pages/diaDiem',
                },
            ],
        },
        {
            title: 'Hợp đồng',
            icon: 'file-text-outline',
            link: '/pages/hopDong',
        },
        {
            title: 'Khách hàng',
            icon: 'people-outline',
            link: '/pages/qlkh',
        },
        {
            title: 'Thống kê',
            icon: 'pie-chart-outline',
            link: '/pages/charts',
        },
        {
            title: 'Công nợ',
            icon: 'fas fa-cash-register',
        },
    ];

    constructor(
        public menuService: NbMenuService,
        public shareDataService: ShareDataService,
        public changeDetectorRef: ChangeDetectorRef,
        public authService: AuthService,
        private router: Router,
    ) {}
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        this.fetchAndGetUser();
    }
    async fetchAndGetUser() {
        let currentUser = this.authService.getCurrentUser();
        if (currentUser) {
            if (currentUser.get('status') > 0) {
                this.router.navigate(['pages']);
            } else {
                this.router.navigate(['home']);
            }
        }
    }
}
