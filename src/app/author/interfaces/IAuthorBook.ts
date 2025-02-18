import { IAuthorBookCategory } from "./IAuthorBookCategory";

export interface IAuthorBook {
    id?: string;
    title: string;
    publishedDate?: Date;
    genere: string;
    categories: IAuthorBookCategory[];
    createdDate: Date;
    modifiedDate?: Date;
    isDeleted?: boolean;
  }