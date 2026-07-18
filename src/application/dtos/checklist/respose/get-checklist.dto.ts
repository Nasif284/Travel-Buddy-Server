export interface GetChecklistResponseDTO {
  summary: ChecklistSummary;
  categories: ChecklistCategorySummary[];
  groupedItems: Record<string, ChecklistItem[]>;
  myTasks: ChecklistItem[];
}

export interface ChecklistSummary {
  completed: number;
  total: number;
}

export interface ChecklistCategory {
  code: string;
  name: string;
}

export interface ChecklistCategorySummary extends ChecklistCategory {
  completed: number;
  total: number;
}

export interface ChecklistMember {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface ChecklistItem {
  id: string;
  title: string;
  notes: string | null;

  isCompleted: boolean;

  priorityCode: string;
  categoryCode: string;

  assignee: ChecklistMember | null;

  createdAt: Date;
  completedAt: Date | null;
}

export interface ChecklistRepositoryResult {
  categories: ChecklistCategory[];
  items: ChecklistItem[];
}
