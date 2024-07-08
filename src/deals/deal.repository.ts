import { ConnectionsManager } from '../commons/db/ConnectionsManager';
import { Deal, DealSchema } from './entities/deal.entity';
import { model, Model } from 'mongoose';

export class DealsRepository {
  private static readonly schemaVersion = 0;
  private readonly dealModel: Model<Deal>;
  constructor() {
    this.dealModel = model<Deal>('Deal', DealSchema);
  }

  async findOne(id: string): Promise<Deal | undefined> {
    try {
      await ConnectionsManager.connect();
      return await this.dealModel.findById(id);
    } finally {
      await ConnectionsManager.disconnect();
    }
  }

  async find(opts: { filters: { client?: string }; pagination: { page: number; pageSize: number } }): Promise<Deal[]> {
    try {
      await ConnectionsManager.connect();
      const { filters, pagination } = opts;
      pagination.page = pagination.page >= 1 ? pagination.page : 1;
      pagination.pageSize = pagination.pageSize >= 1 && pagination.pageSize <= 100 ? pagination.pageSize : 1;

      return await this.dealModel
        .find(JSON.parse(JSON.stringify(filters)))
        .skip((pagination.page - 1) * pagination.pageSize)
        .limit(pagination.pageSize);
    } finally {
      await ConnectionsManager.disconnect();
    }
  }

  async save(deal: Omit<Deal, 'id' | '__version' | '__schemaVersion'>): Promise<Deal> {
    try {
      await ConnectionsManager.connect();
      const dealDocument = new this.dealModel({
        name: deal.name,
        client: deal.client,
        __version: 0,
        __schemaVersion: DealsRepository.schemaVersion,
      });

      return await dealDocument.save();
    } finally {
      await ConnectionsManager.disconnect();
    }
  }

  async update(
    id: string,
    deal: Partial<Omit<Deal, 'id' | '__version' | '__schemaVersion'>>,
  ): Promise<Deal | undefined> {
    try {
      await ConnectionsManager.connect();

      const document = await this.dealModel.findById(id);

      if (document) {
        if (deal.name) document.name = deal.name;
        if (deal.client) document.client = deal.client;

        return await document.save();
      }
    } finally {
      await ConnectionsManager.disconnect();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await ConnectionsManager.connect();

      const document = await this.dealModel.deleteOne({ _id: id });

      return !!document.deletedCount;
    } finally {
      await ConnectionsManager.disconnect();
    }
  }

  async countPerClient(client?: string) {
    try {
      await ConnectionsManager.connect();
      return await (client ? this.dealModel.countDocuments({ client }) : this.dealModel.estimatedDocumentCount());
    } finally {
      await ConnectionsManager.disconnect();
    }
  }
}
