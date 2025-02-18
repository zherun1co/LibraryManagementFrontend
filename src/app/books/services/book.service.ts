import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IBooks } from '../interfaces/IBooks';
import { IBook } from '../interfaces/IBook';
import { IFilterGetBook } from '../interfaces/IFilterGetBook';
import { IAuthorBookCategory } from '../../author/interfaces/IAuthorBookCategory';
import { IDefaultResponse } from '../../utils/interfaces/defaults/IDefaultResonse';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiURL: string = 'http://localhost:5050/api/books';

  constructor(private httpClient: HttpClient) { }

  public getBooks(filter: IFilterGetBook): Observable<IDefaultResponse<IBooks>> {
    let httpParams = new HttpParams();

    if (filter.author)
      httpParams = httpParams.set('author', filter.author);

    if (filter.title)
      httpParams = httpParams.set('title', filter.title);

    if (filter.category)
      httpParams = httpParams.set('category', filter.category);

    if (filter.isDeleted !== undefined && filter.isDeleted !== null)
      httpParams = httpParams.set('isDeleted', filter.isDeleted.toString());

    if (filter.offset !== undefined && filter.offset !== null)
      httpParams = httpParams.set('offset', filter.offset.toString());

    if (filter.limit !== undefined && filter.limit !== null)
      httpParams = httpParams.set('limit', filter.limit.toString());

    return this.httpClient.get<IDefaultResponse<IBooks>>(this.apiURL, { params: httpParams });
  }

  getBookById(id: string): Observable<IDefaultResponse<IBook>> {
    return this.httpClient.get<IDefaultResponse<IBook>>(`${this.apiURL}/${id}`);
  }

  public addBook(book: IBook): Observable<IDefaultResponse<IBook>> {
    return this.httpClient.post<IDefaultResponse<IBook>>(this.apiURL, book);
  }

  public updateBook(book: IBook): Observable<IDefaultResponse<IBook>> {
    return this.httpClient.patch<IDefaultResponse<IBook>>(`${this.apiURL}/${book.id}`, book);
  }

  addCategoryBook(id: string, category: IAuthorBookCategory): Observable<IDefaultResponse<IAuthorBookCategory>> {
    return this.httpClient.post<IDefaultResponse<IAuthorBookCategory>>(`${this.apiURL}/${id}/categories`, category);
  }

  deleteCategoryBook(id: string, categoryId: string): Observable<IDefaultResponse> {
    return this.httpClient.delete<IDefaultResponse>(`${this.apiURL}/${id}/categories/${categoryId}`);
  }
}