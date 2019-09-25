import { Component } from '@angular/core';

@Component({
    selector: 'ngx-one-column-layout',
    styleUrls: ['./one-column.layout.scss'],
    template: `
        <nb-layout windowMode>
            <nb-layout-header fixed>
                <ngx-header></ngx-header>
            </nb-layout-header>

            <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
                <ng-content select="nb-menu"></ng-content>
            </nb-sidebar>

            <nb-layout-column class="p-1">
                <ng-content select="router-outlet"></ng-content>
            </nb-layout-column>
        </nb-layout>
    `,
})
export class OneColumnLayoutComponent {}
