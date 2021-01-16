export interface Record<T> {
  readonly identifier: string;
  readonly value: T;
  readonly timestamp: number;
}
