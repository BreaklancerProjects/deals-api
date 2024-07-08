import mongoose, { ConnectOptions } from 'mongoose';
import { getMongoURI } from '../../config/environment';

export class ConnectionsManager {
  private static readonly uri = getMongoURI();
  private static readonly clientOptions: ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  };

  static async connect() {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(this.uri, this.clientOptions);
    // await mongoose.connection.db.admin().command({ ping: 1 });
    // console.log('Pinged your deployment. You successfully connected to MongoDB!');

    mongoose.connection.on('error', (err) => {
      console.error(err);
    });
  }

  static async disconnect() {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
