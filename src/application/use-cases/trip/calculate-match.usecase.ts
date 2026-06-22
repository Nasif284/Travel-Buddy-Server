import { inject, injectable } from 'tsyringe';
import { ICalculateMatch } from '../../interfaces/use-cases/trip/calculate-match.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
@injectable()
export class CalculateMatch implements ICalculateMatch {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { tripId: string }): Promise<void> {
    const sourceTrip = await this._tripRepository.getTripForMatching(
      dto.tripId,
    );
    const candidateTrips = await this._tripRepository.getCandidateTrips(
      dto.tripId,
    );
    if (!candidateTrips) {
      return;
    }
    for (const targetTrip of candidateTrips) {
      let destinationScore = 0;
      let dateScore = 0;

      const reasons: string[] = [];

      if (sourceTrip.destinationId === targetTrip.destinationId) {
        destinationScore = 35;

        reasons.push(`Both traveling to ${sourceTrip.destination.name}`);
      } else if (
        sourceTrip.destination.state &&
        sourceTrip.destination.state === targetTrip.destination.state
      ) {
        destinationScore = 30;
        reasons.push(`Both traveling to ${sourceTrip.destination.state}`);
      } else if (
        sourceTrip.destination.country === targetTrip.destination.country
      ) {
        destinationScore = 20;
        reasons.push(`Both traveling to ${sourceTrip.destination.country}`);
      }

      const overlapStart = Math.max(
        new Date(sourceTrip.dateFrom).getTime(),

        new Date(targetTrip.dateFrom).getTime(),
      );

      const overlapEnd = Math.min(
        new Date(sourceTrip.dateTo).getTime(),

        new Date(targetTrip.dateTo).getTime(),
      );

      if (overlapEnd > overlapStart) {
        const overlapDays = (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24);

        const tripDays =
          (new Date(sourceTrip.dateTo).getTime() -
            new Date(sourceTrip.dateFrom).getTime()) /
          (1000 * 60 * 60 * 24);

        dateScore = Math.round((overlapDays / tripDays) * 20);

        reasons.push(`Trip dates overlap for ${Math.round(overlapDays)} days`);
      }

      type TravelStyleCode = 'adventure' | 'cultural' | 'leisure';
      type TravelStyles = {
        adventure: number;
        cultural: number;
        leisure: number;
      };
      const styleMatrix: Record<TravelStyleCode, TravelStyles> = {
        adventure: {
          adventure: 10,
          cultural: 6,
          leisure: 3,
        },
        cultural: {
          adventure: 6,
          cultural: 10,
          leisure: 6,
        },
        leisure: {
          adventure: 3,
          cultural: 6,
          leisure: 10,
        },
      };

      const travelStyleScore =
        styleMatrix[sourceTrip.travelStyleCode as TravelStyleCode]?.[
          targetTrip.travelStyleCode as TravelStyleCode
        ] ?? 0;

      if (travelStyleScore >= 8) {
        reasons.push(`Both prefer ${sourceTrip.travelStyleCode} travel`);
      }

      type BudgetStyleCode = 'budget' | 'moderate' | 'premium' | 'luxury';
      type BudgetStyles = {
        budget: number;
        moderate: number;
        premium: number;
        luxury: number;
      };
      const budgetMatrix: Record<BudgetStyleCode, BudgetStyles> = {
        budget: {
          budget: 10,
          moderate: 8,
          premium: 4,
          luxury: 0,
        },

        moderate: {
          budget: 8,
          moderate: 10,
          premium: 8,
          luxury: 4,
        },

        premium: {
          budget: 4,
          moderate: 8,
          premium: 10,
          luxury: 8,
        },

        luxury: {
          budget: 0,
          moderate: 4,
          premium: 8,
          luxury: 10,
        },
      };

      const budgetScore =
        budgetMatrix[sourceTrip.budgetStyleCode as BudgetStyleCode]?.[
          targetTrip.budgetStyleCode as BudgetStyleCode
        ] ?? 0;

      // if (budgetScore == 10) {
      //   reasons.push(
      //     `Both prefer ${sourceTrip.budgetStyleCode} as budget style`,
      //   );
      // }

      type PersonalityCode = 'introvert' | 'ambivert' | 'extrovert';

      type Personalities = {
        introvert: number;
        ambivert: number;
        extrovert: number;
      };

      const personalityMatrix: Record<PersonalityCode, Personalities> = {
        introvert: {
          introvert: 15,
          ambivert: 10,
          extrovert: 5,
        },

        ambivert: {
          introvert: 10,
          ambivert: 15,
          extrovert: 10,
        },

        extrovert: {
          introvert: 5,
          ambivert: 10,
          extrovert: 15,
        },
      };

      const personalityScore =
        personalityMatrix[
          sourceTrip.creator.travelPersonalityCode as PersonalityCode
        ]?.[targetTrip.creator.travelPersonalityCode as PersonalityCode] ?? 0;

      const sourceInterests = sourceTrip.creator.interests.map(
        (i) => i.interestCode,
      );

      const candidateInterests = targetTrip.creator.interests.map(
        (i) => i.interestCode,
      );

      const sharedInterests = sourceInterests.filter((interest: string) =>
        candidateInterests.includes(interest),
      );

      const similarity =
        sharedInterests.length /
        Math.max(sourceInterests.length, candidateInterests.length);

      const interestScore = Math.round(similarity * 10);

      if (sharedInterests.length > 0) {
        reasons.push(`Shared interests: ${sharedInterests.join(', ')}`);
      }

      const sourceLanguages = sourceTrip.creator.languages.map(
        (l) => l.languageCode,
      );

      const targetLanguages = targetTrip.creator.languages.map(
        (l) => l.languageCode,
      );

      const sharedLanguages = sourceLanguages.filter((lang) =>
        targetLanguages.includes(lang),
      );

      const languageSimilarity =
        sharedLanguages.length /
        Math.max(sourceLanguages.length, targetLanguages.length);

      const languageScore = Math.round(languageSimilarity * 10);

      if (sharedLanguages.length) {
        reasons.push(`Common languages: ${sharedLanguages.join(', ')}`);
      }

      const totalScore =
        destinationScore +
        dateScore +
        travelStyleScore +
        budgetScore +
        personalityScore +
        interestScore;

      await this._tripRepository.saveTripMatch({
        budgetScore,
        dateScore,
        destinationScore,
        explanation: {
          reasons,
        },
        interestScore,
        languageScore,
        personalityScore,
        totalScore,
        travelStyleScore,
        sourceTripId: sourceTrip.id,
        targetTripId: targetTrip.id,
      });
    }
  }
}
