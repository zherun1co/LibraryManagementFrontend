export interface IAuthor {
    id: string | null;
    name: string;
    dateOfBirth?: Date | null;
    isDeleted?: boolean | null;
    createdDate: Date;
    modifiedDate?: Date | null;
  }