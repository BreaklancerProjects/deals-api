import { v4 } from 'uuid';
import { NestedError, toError } from 'ts-nested-error';

export class NotFoundError extends NestedError {
  public readonly id: string;

  static readonly type: string = 'NotFoundError';

  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors.map((v) => toError(v)));
    this.id = v4();
  }
}
