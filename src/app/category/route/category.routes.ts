import { Routes } from '@angular/router';

import { CategoryListComponent } from '../components/category-list/category-list.component';
import { CategoryItemComponent } from '../components/category-item/category-item.component';

export const CategoryRoutes: Routes = [{
    path: '',
    component: CategoryListComponent
  }, {
    path: 'new',
    component: CategoryItemComponent
  }, {
    path: 'edit/:id',
    component: CategoryItemComponent
  }
]