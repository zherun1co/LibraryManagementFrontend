import { IBook } from './IBook';
import { IPaging } from '../../utils/interfaces/defaults/IPaging';

export interface IBooks {
  books: IBook[];
  paging: IPaging;
}