export interface EditChecklistTaskRequestDTO {
  id: string;
  title: string;
  categoryCode: string;
  priorityCode: string;
  assignedTo: string;
  notes?: string;
}
