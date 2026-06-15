import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetCountriesList } from '../../../application/interfaces/use-cases/lookups/get-countries.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../responses/common-response';
import { LOOKUP_MESSAGES } from '../../../shared/constants/messages/success/admin/lookup.messages';

@injectable()
export class LookupController {
  constructor(
    @inject(TOKENS.IGetCountries)
    private readonly _getCountriesUseCase: IGetCountriesList,
  ) {}
  getAllCountries = async (req: Request, res: Response): Promise<Response> => {
    const countries = await this._getCountriesUseCase.execute();
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(LOOKUP_MESSAGES.GET_COUNTRIES, countries));
  };
}
