export interface IFilterGetBook {
    author?: string;
    title?: string;
    category?: string;
    offset?: number;
    limit?: number;
    isDeleted?: boolean | null;
}  