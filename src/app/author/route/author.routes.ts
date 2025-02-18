import { Routes } from '@angular/router';

import { AuthorListComponent } from '../components/author-list/author-list.component';
import { AuthorItemComponent } from '../components/author-item/author-item.component';

export const AuthorRoutes: Routes = [{
    path: '',
    component: AuthorListComponent
  }, {
    path: 'new',
    component: AuthorItemComponent
  }, {
    path: 'edit/:id',
    component: AuthorItemComponent
  }
]