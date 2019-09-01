import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NbAuthService, NbAuthSocialLink } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-add-guide',
    templateUrl: './add-guide.component.html',
    styleUrls: ['./add-guide.component.scss'],
})
export declare class AddGuideComponent implements OnInit {
    protected service: NbAuthService;
    protected options: {};
    protected cd: ChangeDetectorRef;
    protected router: Router;
    redirectDelay: number;
    showMessages: any;
    strategy: string;
    submitted: boolean;
    errors: string[];
    messages: string[];
    user: any;
    socialLinks: NbAuthSocialLink[];
    constructor(service: NbAuthService, options: {}, cd: ChangeDetectorRef, router: Router, protected ref: NbDialogRef<AddGuideComponent>);
    register(): void;
    getConfigValue(key: string): any;
    title = '';
    context = '';

    ngOnInit() {}
    dismiss() {
        this.ref.close();
    }
}
