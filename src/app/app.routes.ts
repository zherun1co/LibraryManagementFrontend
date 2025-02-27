import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [{ 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
}, {
    path: 'home',
    loadChildren: () =>
      import('./home/components/route/home.routes')
        .then(r => r.HomeRoutes)
}, {
    path: 'categories',
    loadChildren: ()=>
        import('./category/route/category.routes')
        .then(r=> r.CategoryRoutes),
    canActivate: [AuthGuard]
}, {
    path: 'authors',
    loadChildren: ()=>
        import('./author/route/author.routes')
        .then(r=> r.AuthorRoutes),
    canActivate: [AuthGuard]
}, {
    path: 'books',
    loadChildren: ()=>
        import('./books/route/book.routes')
        .then(r=> r.BookRoutes),
    canActivate: [AuthGuard]
}, {
    path: '**',
    redirectTo: 'home'
}];