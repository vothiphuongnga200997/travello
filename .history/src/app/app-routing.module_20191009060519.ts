import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from '../app/shared/services/auth-guard.service';
import { HomeComponent } from './sales/home/home.component';
import { SelectTourComponent } from './pages/select-tour/select-tour.component';
import { BookTourComponent } from './pages/book-tour/book-tour.component';
const routes: Routes = [
    { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule', canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'select-tour/:id', component: SelectTourComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
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
