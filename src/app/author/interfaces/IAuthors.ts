import { IAuthor } from "./IAuthor";
import { IPaging } from "../../utils/interfaces/defaults/IPaging";

export interface IAuthors {
    authors: IAuthor[];
    paging: IPaging;
}