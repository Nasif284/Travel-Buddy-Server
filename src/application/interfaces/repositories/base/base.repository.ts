export interface IBaseRepository<TModel, TCreateInput, TUpdateInput> {
  create(data: TCreateInput): Promise<TModel>;

  update(where: object, data: TUpdateInput): Promise<TModel>;

  findFirst(where: object, include: object): Promise<TModel | null>;

  findById(id: string): Promise<TModel | null>;

  findMany(conditions: object): Promise<TModel[]>;
}
