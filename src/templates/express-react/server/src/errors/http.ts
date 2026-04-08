export class BadRequestError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  readonly statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  readonly statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class UnprocessableEntityError extends Error {
  readonly statusCode = 422;

  constructor(message: string) {
    super(message);
    this.name = 'UnprocessableEntityError';
  }
}

export class InternalServerError extends Error {
  readonly statusCode = 500;

  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

export type HttpError =
  | BadRequestError
  | NotFoundError
  | ConflictError
  | UnprocessableEntityError
  | InternalServerError;

export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof BadRequestError ||
  error instanceof NotFoundError ||
  error instanceof ConflictError ||
  error instanceof UnprocessableEntityError ||
  error instanceof InternalServerError;
