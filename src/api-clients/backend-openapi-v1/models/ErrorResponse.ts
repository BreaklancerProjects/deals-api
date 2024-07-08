/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Error } from './Error';
/**
 * Describes the error in greater detail.
 * This will typically be null in a production use case and should only be used for debugging purposes.
 *
 */
export type ErrorResponse = {
  /**
   * An id that can be used to locate this error for tracing and
   * forensics. The internal format of this identifier is undefined,
   * please treat it as an opaque string.
   *
   */
  id: string;
  /**
   * A brief description of what went wrong to help with debugging. May
   * not appear in production releases, do not rely on the message.
   *
   */
  message: string;
  /**
   * This is the type of exception that was raised if known.
   */
  type: string;
  /**
   * This is the text that represents the frame information for
   * this portion of the stack trace. Note that this is language
   * specific, and may contain any information that is relevant.
   *
   */
  stack?: string;
  /**
   * A list of validation issues that were found when processing the request.
   */
  caused_by?: Array<Error>;
};
