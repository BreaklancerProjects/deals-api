import mongoose, { ConnectOptions, model } from 'mongoose';
import { getMongoURI } from './environment';
import { Deal, DealSchema } from '../deals/entities/deal.entity';
import { DealsRepository } from '../deals/deal.repository';

export async function connectToDB() {
  // try {
  //   const uri = getMongoURI();
  //   const clientOptions: ConnectOptions = {
  //     serverSelectionTimeoutMS: 5000,
  //     serverApi: { version: '1', strict: true, deprecationErrors: true },
  //   };
  //   // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
  //   await mongoose.connect(uri, clientOptions);
  //   await mongoose.connection.db.admin().command({ ping: 1 });
  //   const dealModel = model<Deal>('Deal', DealSchema);
  //   console.log(await dealModel.find());
  //   // const dealDocument = new dealModel({
  //   //   name: 'name1',
  //   //   client: 'the client',
  //   //   version: 0,
  //   //   schemaVersion: 0,
  //   // });
  //   // await dealDocument.save();
  //   mongoose.connection.on('error', (err) => {
  //     console.error(err);
  //   });
  //   console.log('Pinged your deployment. You successfully connected to MongoDB!');
  // } finally {
  //   // Ensures that the client will close when you finish/error
  //   await mongoose.disconnect();
  // }
}
// run().catch(console.dir);
