import { v4 as uuidv4 } from 'uuid';
import { NestedError, toError } from 'ts-nested-error';

export class BaseError extends NestedError {
  public readonly id: string;

  constructor(message: string, ...innerErrors: unknown[]) {
    super(message, ...innerErrors.map((v) => toError(v)));
    this.id = uuidv4();
  }
}
