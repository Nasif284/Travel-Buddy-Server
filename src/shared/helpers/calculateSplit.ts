import { CreateExpenseRequestDTO } from '../../application/dtos/expense/request/create-expense.dto';
type CalculatedShare = {
  memberId: string;
  amount: number;
  percentage?: number;
  shares?: number;
};
export function calculateExpenseShares(
  payload: CreateExpenseRequestDTO,
): CalculatedShare[] {
  const { amount, splitMethodCode, participants } = payload;

  switch (splitMethodCode) {
    case 'EQUAL': {
      const shareAmount = Number((amount / participants.length).toFixed(2));

      return participants.map((participant, index) => ({
        memberId: participant.memberId,
        amount:
          index === participants.length - 1
            ? Number(
                (amount - shareAmount * (participants.length - 1)).toFixed(2),
              )
            : shareAmount,
      }));
    }

    case 'PERCENTAGE': {
      return participants.map((participant) => ({
        memberId: participant.memberId,
        percentage: participant.percentage,
        amount: Number(
          (amount * ((participant.percentage ?? 0) / 100)).toFixed(2),
        ),
      }));
    }

    case 'CUSTOM': {
      return participants.map((participant) => ({
        memberId: participant.memberId,
        amount: participant.amount ?? 0,
      }));
    }

    case 'SHARES': {
      const totalShares = participants.reduce(
        (sum, participant) => sum + (participant.shares ?? 0),
        0,
      );

      const valuePerShare = amount / totalShares;

      return participants.map((participant) => ({
        memberId: participant.memberId,
        shares: participant.shares,
        amount: Number((valuePerShare * (participant.shares ?? 0)).toFixed(2)),
      }));
    }

    default:
      return [];
  }
}
