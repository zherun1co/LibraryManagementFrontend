import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'categories',
    loadChildren: ()=>
        import('./category/route/category.routes')
        .then(r=> r.CategoryRoutes)
}, {
    path: 'authors',
    loadChildren: ()=>
        import('./author/route/author.routes')
        .then(r=> r.AuthorRoutes)
}, {
    path: 'books',
    loadChildren: ()=>
        import('./books/route/book.routes')
        .then(r=> r.BookRoutes)
}];