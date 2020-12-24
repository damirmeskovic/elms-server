export interface TokenPayload {
  readonly sub: string;
}

export interface TokenGenerator {
  next(payload: TokenPayload): Promise<string>;
}
