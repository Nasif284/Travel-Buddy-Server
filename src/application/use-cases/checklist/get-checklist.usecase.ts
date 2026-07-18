import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';

import { IChecklistRepository } from '../../interfaces/repositories/checklist.repository';
import {
  ChecklistItem,
  GetChecklistResponseDTO,
} from '../../dtos/checklist/respose/get-checklist.dto';
import { IGetCheckList } from '../../interfaces/use-cases/cheklist/get-checklist.interface';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class GetChecklist implements IGetCheckList {
  constructor(
    @inject(TOKENS.IChecklistRepository)
    private readonly _checklistRepository: IChecklistRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(dto: {
    groupId: string;
    userId: string;
  }): Promise<GetChecklistResponseDTO> {
    const { categories, items } = await this._checklistRepository.getChecklist(
      dto.groupId,
    );

    const summary = {
      completed: items.filter((item) => item.isCompleted).length,
      total: items.length,
    };

    const categorySummary = categories.map((category) => {
      const categoryItems = items.filter(
        (item) => item.categoryCode === category.code,
      );

      return {
        code: category.code.toLowerCase(),
        name: category.name,
        completed: categoryItems.filter((i) => i.isCompleted).length,
        total: categoryItems.length,
      };
    });

    const groupedItems: Record<string, ChecklistItem[]> = {};

    for (const category of categories) {
      groupedItems[category.code.toLowerCase()] = [];
    }

    const myTasks: ChecklistItem[] = [];

    for (const item of items) {
      const mappedItem: ChecklistItem = {
        id: item.id,
        title: item.title,
        notes: item.notes,
        isCompleted: item.isCompleted,
        priorityCode: item.priorityCode,
        categoryCode: item.categoryCode,

        assignee: item.assignee
          ? {
              id: item.assignee.id,
              userId: item.assignee.userId,
              fullName: item.assignee.fullName,
              avatarUrl: await this._storageService.getSignedUrl(
                item.assignee.avatarUrl!,
              ),
            }
          : null,

        createdAt: item.createdAt,
        completedAt: item.completedAt,
      };

      groupedItems[item.categoryCode.toLowerCase()].push(mappedItem);

      if (item.assignee?.userId === dto.userId) {
        myTasks.push(mappedItem);
      }
    }

    return {
      summary,
      categories: categorySummary,
      groupedItems,
      myTasks,
    };
  }
}
