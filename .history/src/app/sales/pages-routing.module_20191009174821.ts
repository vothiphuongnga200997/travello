import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { BookTourComponent } from './book-tour/book-tour.component';
import { HomeComponent } from './home/home.component';
import { SelectTourComponent } from './select-tour/select-tour.component';
import { from } from 'rxjs';
import {LoginComponent} from './login/login.component';
const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {path: 'login'
        component:LoginComponent}
            {
                path: 'book-tour',
                component: BookTourComponent,
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            { path: 'select-tour/:id', component: SelectTourComponent },

            { path: 'home', component: HomeComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
