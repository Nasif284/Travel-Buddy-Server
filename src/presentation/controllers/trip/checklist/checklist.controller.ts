import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetCheckList } from '../../../../application/interfaces/use-cases/cheklist/get-checklist.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { CHECKLIST_MESSAGES } from '../../../../shared/constants/messages/success/trip/cheklist.messages';
import { IAddChecklistTask } from '../../../../application/interfaces/use-cases/cheklist/add-task.interface';
import { IEditTask } from '../../../../application/interfaces/use-cases/cheklist/edit-task.interface';
import { IDeleteTask } from '../../../../application/interfaces/use-cases/cheklist/delete-task.interface';
import { ICompleteTask } from '../../../../application/interfaces/use-cases/cheklist/complete-task.interface';

@injectable()
export class ChecklistController {
  constructor(
    @inject(TOKENS.IGetChecklist)
    private readonly _getChecklist: IGetCheckList,
    @inject(TOKENS.IAddTask)
    private readonly _addTask: IAddChecklistTask,
    @inject(TOKENS.IEditTask)
    private readonly _editTask: IEditTask,
    @inject(TOKENS.IDeleteTask)
    private readonly _deleteTask: IDeleteTask,
    @inject(TOKENS.ICompleteTask)
    private readonly _completeTask: ICompleteTask,
  ) {}
  getChecklist = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const data = await this._getChecklist.execute({
      groupId: id as string,
      userId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CHECKLIST_MESSAGES.GET_CHECKLIST, data));
  };
  addTask = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userId = req.user?.userId;
    console.log(id);
    await this._addTask.execute({
      ...req.body,
      groupId: id,
      createdBy: userId,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CHECKLIST_MESSAGES.TASK_ADDED));
  };
  editTask = async (req: Request, res: Response): Promise<Response> => {
    const { taskId } = req.params;
    await this._editTask.execute({
      ...req.body,
      id: taskId,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CHECKLIST_MESSAGES.EDIT_TASK));
  };
  deleteTask = async (req: Request, res: Response): Promise<Response> => {
    const { taskId } = req.params;
    await this._deleteTask.execute({
      id: taskId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CHECKLIST_MESSAGES.DELETE_TASK));
  };
  completeTask = async (req: Request, res: Response): Promise<Response> => {
    const { taskId } = req.params;
    await this._completeTask.execute({
      id: taskId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CHECKLIST_MESSAGES.COMPLETE_TASK));
  };
}
