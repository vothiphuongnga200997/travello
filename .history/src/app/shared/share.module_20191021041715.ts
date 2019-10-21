import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParseService } from './services/parse.service';
import { AuthService } from './services/auth.service';
import { FormioModule } from 'angular-formio';
import { AngularMonacoEditorModule } from 'angular-monaco-editor';
import { LoadingComponent } from './modules/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { ShareDataService } from './services/share-data.service';
import { AuthGuard } from './services/auth-guard.service';
import { ToastrService } from './services';
import { LocationService } from './services/location.service';
import { GuideService } from './services/guide.service';
import { TourService } from './services/tour.service';
import { ContractService } from './services/contract.service';
import { WatchInfoService } from './services/watch-info-service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
    imports: [CommonModule, FormsModule, AngularMonacoEditorModule],
    declarations: [LoadingComponent],
    exports: [CommonModule, FormsModule, FormioModule, AngularMonacoEditorModule, LoadingComponent],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ParseService,
                AuthGuard,
                AuthService,
                LoadingService,
                ShareDataService,
                ToastrService,
                LocationService,
                GuideService,
                TourService,
                ContractService,
                WatchInfoService,
            ],
        };
    }
}
