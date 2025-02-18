import { Routes } from '@angular/router';

import { BookListComponent } from '../components/book-list/book-list.component';
import { BookItemComponent } from '../components/book-item/book-item.component';

export const BookRoutes: Routes = [{
    path: '',
    component: BookListComponent
  }, {
    path: 'new',
    component: BookItemComponent
  }, {
    path: 'edit/:id',
    component: BookItemComponent
  }
]