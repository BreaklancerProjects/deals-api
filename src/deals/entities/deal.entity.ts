import mongoose from 'mongoose';
const { Schema } = mongoose;

import { Base } from '../../commons/entities/base';
import { BaseSchema } from '../../commons/db/schemas';

// export const DealSchema = new Schema<Deal>(
//   {
//     name: { type: String, required: true, unique: true },
//     client: { type: String, required: true },
//     schemaVersion: { type: Number, required: true },
//   },
//   {
//     optimisticConcurrency: true,
//   },
// );
export const DealSchema = new Schema<Deal>();

DealSchema.add(BaseSchema).add({
  name: { type: String, required: true, unique: true },
  client: { type: String, required: true },
});

export interface Deal extends Base {
  id: string;
  name: string;
  client: string;
}
