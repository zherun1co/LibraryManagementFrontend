import { IAuthorBookCategory } from '../../author/interfaces/IAuthorBookCategory';

export interface IBook {
  id?: string | null;
  title: string;
  authorId?: string;
  authorName: string;
  publishedDate?: Date;
  genere: string;
  categories?: IAuthorBookCategory[];
  createdDate: Date;
  modifiedDate?: Date;
  isDeleted?: boolean;
}