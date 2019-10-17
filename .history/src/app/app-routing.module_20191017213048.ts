import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from '../app/shared/services/auth-guard.service';
const routes: Routes = [
    { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule', canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'login:/id', component: LoginComponent },
    { path: '', redirectTo: 'sales', pathMatch: 'full' },
    { path: 'sales', loadChildren: 'app/sales/pages.module#SalesModule' },
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
