import { NextFunction, Request, Response } from 'express';
import { DealsRepository } from './deal.repository';
import { DealsService } from './deal.service';

export function getDeal(req: Request, res: Response, next: NextFunction) {
  void controller.getDeal(req, res, next);
}

export function getDeals(req: Request, res: Response, next: NextFunction) {
  void controller.getDeals(req, res, next);
}

export function createDeal(req: Request, res: Response, next: NextFunction) {
  void controller.createDeal(req, res, next);
}

export function patchDeal(req: Request, res: Response, next: NextFunction) {
  void controller.patchDeal(req, res, next);
}

export function deleteDeal(req: Request, res: Response, next: NextFunction) {
  void controller.deleteDeal(req, res, next);
}

class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  async getDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.dealsService.getDeal(req.params.id);

      res.status(200).send(result);
    } catch (error) {
      next(error);
      return;
    }
  }

  async getDeals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.dealsService.getDeals(req.query);

      res.status(200).send(result);
    } catch (error) {
      next(error);
      return;
    }
  }

  async createDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.dealsService.createDeal(req.body);

      res.status(201).send(result);
    } catch (error) {
      next(error);
      return;
    }
  }

  async patchDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.dealsService.patchDeal(req.params.id, req.body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
      return;
    }
  }

  // @AuthorizationMiddleware({
  //   roleRequired: Role.ADMIN,
  // })
  async deleteDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.dealsService.deleteDeal(req.params.id);

      res.status(204).send();
    } catch (error) {
      next(error);
      return;
    }
  }
}

const controller = new DealsController(new DealsService(new DealsRepository()));
