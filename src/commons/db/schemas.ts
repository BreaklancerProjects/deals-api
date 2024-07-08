import { Schema } from 'mongoose';
import { Base } from '../entities/base';

export const BaseSchema = new Schema<Base>(
  {
    __schemaVersion: { type: Number, required: true },
  },
  {
    versionKey: '__version',
    optimisticConcurrency: true,
  },
);
