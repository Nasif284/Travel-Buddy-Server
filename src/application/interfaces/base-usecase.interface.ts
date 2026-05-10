export interface IBaseUseCase<T, R, E = undefined> {
  execute(dto: T, files?: E): Promise<R>;
}
