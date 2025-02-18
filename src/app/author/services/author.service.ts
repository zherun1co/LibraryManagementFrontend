import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IAuthor } from '../interfaces/IAuthor';
import { IAuthors } from '../interfaces/IAuthors';
import { IAuthorBook } from '../interfaces/IAuthorBook';
import { IFilterGetAuthor } from '../interfaces/IFilterGetAuthor';
import { IDefaultResponse } from '../../utils/interfaces/defaults/IDefaultResonse';

@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private apiURL: string = 'http://localhost:5050/api/authors';
  
    constructor(private httpClient: HttpClient) { }

    public getAuthors(filter: IFilterGetAuthor): Observable<IDefaultResponse<IAuthors>> {
        let httpParams = new HttpParams();
    
        if (filter.author)
          httpParams = httpParams.set('author', filter.author);
    
        if (filter.isDeleted !== undefined && filter.isDeleted !== null)
          httpParams = httpParams.set('isDeleted', filter.isDeleted.toString());
    
        if (filter.offset !== undefined && filter.offset !== null)
          httpParams = httpParams.set('offset', filter.offset.toString());
    
        if (filter.limit !== undefined && filter.limit !== null)
          httpParams = httpParams.set('limit', filter.limit.toString());
    
        return this.httpClient.get<IDefaultResponse<IAuthors>>(this.apiURL, {
            params: httpParams
        });
    }

    getAuthorById(id: string): Observable<IDefaultResponse<IAuthor>> {
      return this.httpClient.get<IDefaultResponse<IAuthor>>(`${this.apiURL}/${id}`);
    }

    getAuthorBooksByAuthorId(id: string): Observable<IDefaultResponse<IAuthorBook[]>> {
      return this.httpClient.get<IDefaultResponse<IAuthorBook[]>>(`${this.apiURL}/${id}/books`);
    }

    addAuthor(author: IAuthor): Observable<IDefaultResponse<IAuthor>> {
      return this.httpClient.post<IDefaultResponse<IAuthor>>(this.apiURL, author);
    }

    updateAuthor(author: IAuthor): Observable<IDefaultResponse<IAuthor>> {
      return this.httpClient.patch<IDefaultResponse<IAuthor>>(`${this.apiURL}/${author.id}`, author);
    }
}