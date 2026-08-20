import { PrismaClient } from '@prisma/client';

import { IBaseRepository } from '../../../application/interfaces/repositories/base/base.repository';

export abstract class BaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
> implements IBaseRepository<TModel, TCreateInput, TUpdateInput> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly model: any,
  ) {}

  async findById(id: string): Promise<TModel | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findFirst(where: object, include?: object): Promise<TModel | null> {
    return this.model.findFirst({
      where,
      include,
    });
  }

  async findMany(conditions: object): Promise<TModel[]> {
    return this.model.findMany({
      ...conditions,
    });
  }

  async create(data: TCreateInput): Promise<TModel> {
    return this.model.create({
      data,
    });
  }

  async update(where: object, data: TUpdateInput): Promise<TModel> {
    return this.model.update({
      where,
      data,
    });
  }
}
