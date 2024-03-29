import { Component, ChangeDetectorRef } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { ShareDataService } from '../shared/services/share-data.service';
import { AuthService } from '../shared/services/auth.service';
import { InternalNgModuleRef } from '@angular/core/src/linker/ng_module_factory';
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
            title: 'Hướng dẩn viên',
            icon: 'far fa-address-book',
            link: '/pages/qlnv',
        },
        {
            title: 'Tour',
            icon: 'fas fa-plane-departure',
            children: [
                {
                    title: 'Danh sách tour',
                    link: '/pages/tour',
                },
                {
                    title: 'Thời điểm',
                    link: '/pages/tour',
                },
            ],
        },
        {
            title: 'Hợp đồng',
            icon: 'fas fa-id-badge',
            link: '/pages/hopDong',
        },
        {
            title: 'Khách hàng',
            icon: 'fas fa-users',
            link: '/pages/qlkh',
        },
        {
            title: 'Thồng kê',
            icon: 'fas fa-chart-pie',
            link: '/pages/qlkh',
        },
    ];
    menu1: NbMenuItem[] = [
        {
            title: 'Quản lý tour',
            icon: 'fas fa-calendar-alt',
            children: [
                {
                    title: 'Miền Bắc',
                    link: '/pages/qltour',
                },
                {
                    title: 'Miền Trung',
                    link: '/pages/qltour',
                },
                {
                    title: 'Miền Nam',
                    link: '/pages/qltour/' + 'miennam',
                },
            ],
        },
        {
            title: 'Quản lý khách hàng',
            icon: 'fas fa-users',
            link: '/pages/qlkh',
        },
    ];

    constructor(
        public menuService: NbMenuService,
        public shareDataService: ShareDataService,
        public changeDetectorRef: ChangeDetectorRef,
        public authService: AuthService,
    ) {}
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        console.log('pages');
        this.checkUser();
    }
    async checkUser() {
        this.status = await this.authService.checkStatus();
        console.log(this.status);
    }
}
