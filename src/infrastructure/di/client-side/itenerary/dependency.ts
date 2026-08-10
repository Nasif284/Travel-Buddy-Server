import { container } from 'tsyringe';
import { IGetGroupItineraryUseCase } from '../../../../application/interfaces/use-cases/itenary/get-itenary.interface';
import { TOKENS } from '../../tokens';
import { GetGroupItineraryUseCase } from '../../../../application/use-cases/itinerary/get-itinerary.usecase';
import { ICreateItineraryDayUseCase } from '../../../../application/interfaces/use-cases/itenary/create-day.interface';
import { CreateItineraryDayUseCase } from '../../../../application/use-cases/itinerary/create-day.usecase';
import { IUpdateItineraryActivityUseCase } from '../../../../application/interfaces/use-cases/itenary/update-activity.interface';
import { UpdateItineraryActivityUseCase } from '../../../../application/use-cases/itinerary/update-activity.usecase';
import { IToggleActivityCompletionUseCase } from '../../../../application/interfaces/use-cases/itenary/toggle-complete.interface';
import { ToggleActivityCompletionUseCase } from '../../../../application/use-cases/itinerary/toggle-activity-complete.usecase';
import { IDeleteItineraryActivityUseCase } from '../../../../application/interfaces/use-cases/itenary/delete-activity.interface';
import { DeleteItineraryActivityUseCase } from '../../../../application/use-cases/itinerary/delete-activity.usecase';
import { IUpdateItineraryDayUseCase } from '../../../../application/interfaces/use-cases/itenary/update-dat.interface';
import { UpdateItineraryDayUseCase } from '../../../../application/use-cases/itinerary/update-day.usecase';
import { IDeleteItineraryDayUseCase } from '../../../../application/interfaces/use-cases/itenary/delete-day.interface';
import { DeleteItineraryDayUseCase } from '../../../../application/use-cases/itinerary/delete-day.usecase';
import { ICreateItineraryActivityUseCase } from '../../../../application/interfaces/use-cases/itenary/careate-activity.interface';
import { CreateItineraryActivityUseCase } from '../../../../application/use-cases/itinerary/create-activity.usecase';
import { ISetupItineraryUseCase } from '../../../../application/interfaces/use-cases/itenary/setup-itinerary.interface';
import { SetupItineraryUseCase } from '../../../../application/use-cases/itinerary/setup-itinerary.usecase';
import { IGenerateAiItineraryUseCase } from '../../../../application/interfaces/use-cases/itenary/generate-ai-itinerary.interface';
import { GenerateAiItineraryUseCase } from '../../../../application/use-cases/itinerary/generate-ai-itinerary.usecase';
import { ISaveItineraryUseCase } from '../../../../application/use-cases/itinerary/save-tinerary.usecase';
import { SaveItineraryUseCase } from '../../../../application/use-cases/itinerary/save-itinerary.usecase';

export function registerItineraryDependencies() {
  container.registerSingleton<IGetGroupItineraryUseCase>(
    TOKENS.IGetGroupItineraryUseCase,
    GetGroupItineraryUseCase,
  );
  container.registerSingleton<ICreateItineraryDayUseCase>(
    TOKENS.ICreateItineraryDayUseCase,
    CreateItineraryDayUseCase,
  );
  container.registerSingleton<IUpdateItineraryActivityUseCase>(
    TOKENS.IUpdateItineraryActivityUseCase,
    UpdateItineraryActivityUseCase,
  );
  container.registerSingleton<IToggleActivityCompletionUseCase>(
    TOKENS.IToggleActivityCompletionUseCase,
    ToggleActivityCompletionUseCase,
  );
  container.registerSingleton<IDeleteItineraryActivityUseCase>(
    TOKENS.IDeleteItineraryActivityUseCase,
    DeleteItineraryActivityUseCase,
  );
  container.registerSingleton<IUpdateItineraryDayUseCase>(
    TOKENS.IUpdateItineraryDayUseCase,
    UpdateItineraryDayUseCase,
  );
  container.registerSingleton<IDeleteItineraryDayUseCase>(
    TOKENS.IDeleteItineraryDayUseCase,
    DeleteItineraryDayUseCase,
  );
  container.registerSingleton<ICreateItineraryActivityUseCase>(
    TOKENS.ICreateItineraryActivityUseCase,
    CreateItineraryActivityUseCase,
  );
  container.registerSingleton<ISetupItineraryUseCase>(
    TOKENS.ISetupItineraryUseCase,
    SetupItineraryUseCase,
  );
  container.registerSingleton<IGenerateAiItineraryUseCase>(
    TOKENS.IGenerateAiItineraryUseCase,
    GenerateAiItineraryUseCase,
  );
  container.registerSingleton<ISaveItineraryUseCase>(
    TOKENS.ISaveItineraryUseCase,
    SaveItineraryUseCase,
  );
}
