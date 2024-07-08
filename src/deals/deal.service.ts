import { DealsRepository } from './deal.repository';
import { DealCreateDTO, DealPatchDTO, DealResponseDTO, DealsResponseDTO } from '../api-clients/backend-openapi-v1';
import { NotFoundError } from '../errors/NotFoundError';

export class DealsService {
  constructor(private readonly repo: DealsRepository) {}

  async getDeal(id: string): Promise<DealResponseDTO> {
    const deal = await this.repo.findOne(id);

    if (!deal) throw new NotFoundError(`Could not find deal with id ${id}`);

    return {
      id,
      name: deal.name,
      client: deal.client,
    };
  }

  async getDeals(opts: { client?: string; page?: number; pageSize?: number }): Promise<DealsResponseDTO> {
    const deals = await this.repo.find({
      filters: { client: opts.client },
      pagination: { page: opts.page, pageSize: opts.pageSize },
    });

    const estimatedTotal = await this.repo.countPerClient(opts.client);

    return {
      deals: deals.map((deal) => ({
        id: deal.id,
        name: deal.name,
        client: deal.client,
      })),
      total: estimatedTotal,
    };
  }

  async createDeal(data: DealCreateDTO): Promise<DealResponseDTO> {
    const created = await this.repo.save(data);

    return {
      id: created.id,
      name: created.name,
      client: created.client,
    };
  }

  async patchDeal(id: string, data: DealPatchDTO): Promise<DealResponseDTO> {
    const created = await this.repo.update(id, data);

    if (!created) throw new NotFoundError(`Could not delete deal with id ${id}`);

    return {
      id,
      name: created.name,
      client: created.client,
    };
  }

  async deleteDeal(id: string) {
    if (!(await this.repo.delete(id))) throw new NotFoundError(`Could not delete deal with id ${id}`);
  }
}
