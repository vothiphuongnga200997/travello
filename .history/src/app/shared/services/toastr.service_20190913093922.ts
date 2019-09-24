import { Injectable } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';

@Injectable()
export class ToastrService {
    configError: any = {
        destroyByClick: true,
        duration: 2000,
        hasIcon: true,
        icon: 'nb-alert',
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        preventDuplicates: false,
    };
    configSuccess: any = {
        destroyByClick: true,
        duration: 2000,
        hasIcon: true,
        icon: 'nb-checkmark-circle',
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        preventDuplicates: false,
    };
    configWarning: any = {
        destroyByClick: true,
        duration: 2000,
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        preventDuplicates: false,
    };
    constructor(private toastrService: NbToastrService) {}

    error(message, title?) {
        this.toastrService.show(message, title, this.configError);
    }

    success(message, title?) {
        this.toastrService.show(message, title, this.configSuccess);
    }

    warning(message, title?) {
        this.toastrService.show(message, title, this.configWarning);
    }

    show(message, title?, config?) {
        this.toastrService.show(message, title, config);
    }
}
