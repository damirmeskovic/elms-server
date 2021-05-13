export interface AuthorRecord {
  readonly name: string;
  readonly country: string;
  readonly bio?: string;
  readonly tagIdentifiers?: string[];
}
