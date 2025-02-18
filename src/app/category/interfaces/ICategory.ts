import { ICategoryBook } from "./ICategoryBook";

export interface ICategory {
    id?: string | null;
    name: string;
    isDeleted?: boolean | null;
    createdDate: Date;
    modifiedDate?: Date | null;
    books?: ICategoryBook[];
}