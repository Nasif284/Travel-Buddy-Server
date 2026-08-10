export interface IDeleteItineraryDayUseCase {
  execute(dto: { dayId: string }): Promise<void>;
}
