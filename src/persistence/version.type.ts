import { Record } from './record';

export interface Version<T extends Record> {
  readonly identifier: string;
  readonly value: T;
  readonly timestamp: number;
}
