import { Component, OnInit, Input } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { AnalyticsService } from '../../../@core/utils';

import { LayoutService } from '../../../@core/utils';

import {AuthService} from '../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  userPictureOnly: boolean = false;
  user: any;

  @Input() position = 'normal';
    loading = false;
    

  currentTheme = 'default';

  userMenu = [ {   title: 'Log out',
  link: '/login',
  click: () => {
      this.logout();
  },
 } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private layoutService: LayoutService,
              private authService: AuthService,
              private router: Router,
              private analyticsService: AnalyticsService,
              ) {
  }

  ngOnInit() {
    let self = this;
        setTimeout(function() {
            self.loading = true;
        }, 200);
        this.fetchAndGetUser();
        this.menuService.onItemClick().subscribe(async (event: any) => {
            if (event.item.click) {
                await event.item.click();
            }
        });
  }
  async fetchAndGetUser() {
    let currentUser = this.authService.getCurrentUser();
    if (currentUser) {
        currentUser = await this.authService.getCurrentUser().fetch();
        this.user = {
            name: currentUser.get('fullname'),
            picture: currentUser.get('avatar') ? currentUser.get('avatar').url() : 'assets/images/user_default.png',
        };
    } else {
        this.user = {
            name: 'Guest',
            picture: 'assets/images/user_default.png',
        };
    }
}
  async logout() {
    try {
        await this.authService.logout();
        this.router.navigate(['login']);
    } catch (ex) {
        this.router.navigate(['login']);
    }
}
  

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  startSearch() {
    this.analyticsService.trackEvent('startSearch');
}
}
