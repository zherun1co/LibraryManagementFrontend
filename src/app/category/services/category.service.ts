import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ICategory } from '../interfaces/ICategory';
import { IFilterGetCategory } from '../interfaces/IFilterGetCategory';
import { IDefaultResponse } from '../../utils/interfaces/defaults/IDefaultResonse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiURL: string = 'http://localhost:5050/api/categories';

  constructor(private httpClient: HttpClient) { }

  getCategories(filter?: IFilterGetCategory): Observable<IDefaultResponse<ICategory[]>> {
    let httpParams = new HttpParams();

    if (filter) {
      if (filter.category)
        httpParams = httpParams.set('category', filter.category);

      if (filter.isDeleted !== undefined && filter.isDeleted !== null)
        httpParams = httpParams.set('isDeleted', filter.isDeleted.toString());

      if (filter.limit)
        httpParams = httpParams.set('limit', filter.limit);
    }

    return this.httpClient.get<IDefaultResponse<ICategory[]>>(this.apiURL, {
      params: httpParams
    });
  }

  getCategoryById(id: string): Observable<IDefaultResponse<ICategory>> {
    return this.httpClient.get<IDefaultResponse<ICategory>>(`${this.apiURL}/${id}`);
  }

  addCategory(category: ICategory): Observable<IDefaultResponse<ICategory>>{
    return this.httpClient.post<IDefaultResponse<ICategory>>(this.apiURL, category);
  }

  updateCategory(category: ICategory): Observable<IDefaultResponse<ICategory>>{
    return this.httpClient.patch<IDefaultResponse<ICategory>>(`${this.apiURL}/${category.id}`, category);
  }
}