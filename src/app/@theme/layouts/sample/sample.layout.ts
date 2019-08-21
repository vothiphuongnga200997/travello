import { Component, OnDestroy } from '@angular/core';
import { delay, withLatestFrom, takeWhile } from 'rxjs/operators';
import {
    NbMediaBreakpoint,
    NbMediaBreakpointsService,
    NbMenuService,
    NbSidebarService,
    NbThemeService,
    // NbDialogService,
    NbMenuItem,
} from '@nebular/theme';

import { StateService } from '../../../@core/utils';
// import { QuickStartService } from '../../../shared/services/quickstart.service';
// import { ToastrService, ExecuteRobotService, InspectService } from '../../../shared/services';
import { DialogInterface } from '../../../shared/interface';
// import { DialogComponent } from '../../../shared/modules/dialog/dialog.component';
// TODO: move layouts into the framework
@Component({
    selector: 'ngx-sample-layout',
    styleUrls: ['./sample.layout.scss'],
    templateUrl: './sample.layout.html',
})
export class SampleLayoutComponent implements OnDestroy {
    public code: string = ``;
    public currentWorkFlow: any = {};
    layout: any = {};
    sidebar: any = {};

    private alive = true;
    menu: NbMenuItem[] = [];
    currentTheme: string;

    constructor(
        // private dialogService: NbDialogService,

        // private toastrService: ToastrService,

        protected stateService: StateService,
        protected menuService: NbMenuService,
        protected themeService: NbThemeService,
        protected bpService: NbMediaBreakpointsService,
        protected sidebarService: NbSidebarService, // private quickStartService: QuickStartService,
    ) {
        console.log('sample');
        // this.listWorkflow();

        this.stateService
            .onLayoutState()
            .pipe(takeWhile(() => this.alive))
            .subscribe((layout: string) => (this.layout = layout));

        this.stateService
            .onSidebarState()
            .pipe(takeWhile(() => this.alive))
            .subscribe((sidebar: string) => {
                this.sidebar = sidebar;
            });

        const isBp = this.bpService.getByName('is');
        this.menuService
            .onItemSelect()
            .pipe(
                takeWhile(() => this.alive),
                withLatestFrom(this.themeService.onMediaQueryChange()),
                delay(20),
            )
            .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {
                if (bpTo.width <= isBp.width) {
                    this.sidebarService.collapse('menu-sidebar');
                }
            });

        this.themeService
            .getJsTheme()
            .pipe(takeWhile(() => this.alive))
            .subscribe(theme => {
                this.currentTheme = theme.name;
            });
    }
    dialogConfig: DialogInterface = {
        title: '',
        content: '',
    };

    ngOnDestroy() {
        this.alive = false;
    }
}
