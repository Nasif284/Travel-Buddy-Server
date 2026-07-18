export interface AddTaskToChecklistRequestDTO {
  title: string;
  groupId: string;
  categoryCode: string;
  priorityCode: string;
  assignedTo: string;
  createdBy: string;
  notes?: string;
}
