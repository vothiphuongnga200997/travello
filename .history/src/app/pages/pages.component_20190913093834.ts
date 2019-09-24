import { Component, ChangeDetectorRef } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { ShareDataService } from '../shared/services/share-data.service';
import { AuthService } from '../shared/services/auth.service';

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
            title: 'Thồng kê',
            icon: 'pie-chart-outline',
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
    ngOnInit() {}
}
