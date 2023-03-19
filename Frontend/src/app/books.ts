export interface Book {
  isbn: string;
  title: string;
  author: string;
  add_date: Date;
  remove_date: Date | null;
  story: string;
}
