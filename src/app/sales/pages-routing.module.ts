import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { BookTourComponent } from './book-tour/book-tour.component';
import { HomeComponent } from './home/home.component';
import { SelectTourComponent } from './select-tour/select-tour.component';
import { DetailComponent } from './detail/detail.component';
import { WatchInfoComponent } from './watch-info/watch-info.component';
import { ResultTourComponent } from './result-tour/result-tour.component';
const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: 'book-tour/:id',
                component: BookTourComponent,
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            { path: 'select-tour/:id', component: SelectTourComponent },
            { path: 'detail/:id', component: DetailComponent },
            { path: 'home', component: HomeComponent },
            { path: 'watch-info/:id', component: WatchInfoComponent },
            { path: 'resultTour', component: ResultTourComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
