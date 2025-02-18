export interface ICategoryBook {
    id?: string | null;
    title: string;
    authorId?: string | null;
    authorName: string;
    publishedDate?: Date | null;
    genere: string;
    createdDate: Date;
    modifiedDate?: Date | null;
    isDeleted?: boolean | null;
}